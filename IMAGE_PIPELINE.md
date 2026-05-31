# Place-Image Pipeline

How Nomad resolves and serves a real photo for every destination, city, and
trip hero — and why it was rebuilt. This spans three services
(`nomad-agent`, `nomad-api`, `nomad-web`); this doc lives in the web repo
because that's where the symptoms showed up.

> **TL;DR** — Images used to be resolved lazily *on the read path* (and from two
> different writers), then hotlinked from Wikimedia/Unsplash and served
> `unoptimized`. That caused slow first loads, occasional broken images, and a
> read/write race. Now the **agent resolves + self-hosts every image at build
> time** (single writer, no race), Node and web are **read-only**, and the web
> serves them through the **Next/Vercel optimizer**.

---

## 1. The old architecture

```
Agent writes itinerary (place names only, image columns = null)
        │
        ▼
First GET /trips/:id/full  ── Node resolves hero + every city via Wikipedia,
   (blocking, on read)         writes URLs back to the DB, THEN returns
        │
        ▼
Frontend <RemoteImage>  ── renders unoptimized; on error falls back to a
                            hardcoded Unsplash photo-ID; else a gradient
GET /trending  ── Node lazily hydrates trending images on read (debounced)
```

The 3-tier fallback idea (real photo → themed Unsplash → gradient) was sound.
The **plumbing around it** was the problem.

## 2. What was wrong

### Symptom: slow image load
| # | Root cause |
|---|---|
| 1 | **Resolution ran on the request critical path.** The first open of any itinerary *blocked* the `/full` response while Node hit Wikipedia for the hero **+ every city** (each up to 2 sequential round-trips), then did a DB transaction — commonly +1–3s of TTFB before anything rendered. |
| 2 | **No timeout** on the Wikipedia fetch — a single slow upstream call could stall the whole itinerary load. |
| 3 | **Served `unoptimized`.** `next/image unoptimized` disables resizing *and* `srcset`, so a 1280px image was downloaded into a 280px card. Brutal on mobile. |
| 4 | **No edge cache we control** — every browser hit `upload.wikimedia.org` directly (thin POPs in some regions, variable latency). |

### Symptom: image doesn't load at all
| # | Root cause |
|---|---|
| 5 | **Frozen dead URLs.** Once `imagesResolvedAt` was set, the Wikimedia URL was cached in the DB forever; if it later 404'd/throttled, every load broke with no re-resolution. |
| 6 | **The fallback could itself be broken.** A dead hardcoded Unsplash ID left `RemoteImage` re-firing `onError` on a broken `<img>` with no terminal state. |
| 7 | **Hotlinking Wikimedia at scale** is fragile/throttled. |

### The structural flaw
There were **two writers** of the image columns — the agent (content) and Node
(lazy, on read) — which is a textbook **read/write race**: a user opening a trip
while a write was in flight could collide.

## 3. The new architecture

**Single-writer, resolve-at-build-time, read-only-at-serve-time.**

```
Agent pipeline (BackgroundTask), "building" phase
   │  synthesize itinerary  →  resolve hero + each unique city
   │  (Wikipedia → Pexels)  →  download bytes  →  upload to Supabase Storage
   │                        →  write hero_image_url / image_url to the DB
   ▼  THEN mark trip 'ready' / 'completed'
─────────────────────────────────────────────── (status flag = barrier)
Frontend reads GET /full  ──► URLs already present (self-hosted) → render
Node  = read-only         ──► serves stored URLs, never resolves on read
Web   <RemoteImage>       ──► Next/Vercel optimizer: AVIF/WebP + per-`sizes`
                              resize + edge cache; fallback ladder below
```

### Why it's race-free
- There is **exactly one writer** of image columns — the agent — running
  **sequentially inside a single background task**.
- It finishes writing images **before** flipping `status` to `completed`.
- The frontend only reads `/full` **after** `completed`. So the status flag is a
  happens-before **barrier**: reads never observe a partial write, and nothing
  else ever writes images. No concurrent writers ⇒ no race.

### Why it's fastest
Images are resolved, self-hosted, and (on the web) optimized **before the first
view**. The first paint ships real Supabase-CDN URLs — no resolution latency, no
error→fallback flash, correctly-sized AVIF/WebP per surface.

### Communication stays DB-mediated
The agent never calls Node (honouring `nomad-agent/.claude/rules/db-contract.md`).
It writes the shared DB; Node reads it. No webhook.

## 4. What shipped (by phase / repo)

**nomad-agent** — `feat/agent-image-resolution`
1. `app/tools/place_image.py` — Wikipedia (exact→fuzzy, 1280px thumbnails,
   non-photo rejection) + optional Pexels long-tail, bounded timeouts, memo.
2. `app/images.py` + `supabase_writer` — resolve → download → upload to the
   public Storage bucket; write `image_url` per day + `hero_image_url`; wired
   into the `building` phase, best-effort (never blocks completion).
3. `trending.py` — resolve + self-host a photo per trending destination at
   refresh time (`TrendingDest.imageUrl`).

**nomad-api** — `feat/image-serve-only`
1. `getTripFull` no longer resolves on read — serves stored URLs only.
2. `GET /trending` serves stored URLs — lazy hydration removed.
3. Deleted `placeImage.service.ts` (no importers left); the agent owns
   resolution now.

**nomad-web** — `feat-frontend-improvements`
1. `next.config.ts` + `RemoteImage` — AVIF/WebP, `minimumCacheTTL`, dropped
   `unoptimized` (optimizer only ever sees bounded, self-hosted images now).
2. `RemoteImage` fallback hardened into a terminal ladder:
   **resolved src → themed Unsplash fallback → gradient** (no permanent broken
   `<img>`, even if the fallback URL itself 404s).
3. This document.

## 5. Setup required (one-time)

1. **Create a public Supabase Storage bucket** named `place-images` (or set
   `SUPABASE_IMAGE_BUCKET` to your name). Public read is required for direct
   CDN URLs.
2. **Agent env** (`nomad-agent`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   (already required), `SUPABASE_IMAGE_BUCKET` (optional, default
   `place-images`), and optionally `PEXELS_API_KEY` for long-tail matching.
3. **Web**: the Supabase project host is already whitelisted in
   `next.config.ts` `images.remotePatterns`.
4. **Deploy order:** ship `nomad-agent` + `nomad-api` together (Node stops
   resolving, so it relies on the agent to populate new trips). `nomad-web` can
   ship anytime — optimization is backward-compatible with existing URLs.

## 6. Graceful degradation (nothing here is a hard dependency)
- No `PEXELS_API_KEY` → Wikipedia-only resolution.
- Bucket/creds missing or upload fails → the agent stores the **upstream** URL
  (still works, just not self-hosted).
- No photo found → URL is `null` → frontend shows the deterministic themed
  fallback.

## 7. Trade-offs & future work
- **Pre-existing trips never opened before this change** (null image columns)
  now show themed fallbacks instead of being resolved on first open. A one-off
  agent backfill script over `trips WHERE images_resolved_at IS NULL` would heal
  them — deliberately *not* on the read path (that would reintroduce the race).
- **Per-image attribution** (photographer/license) isn't persisted yet. Pexels
  doesn't legally require it; if Unsplash is enabled later, add an attribution
  column and surface it via `SourceBadge`.
- **Itinerary page is client-rendered.** SSR-ing it (with the hero as a
  `priority` preload) would shave the initial fetch→render hop further; deferred
  to avoid refactoring a heavily-interactive page.
