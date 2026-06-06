# Nomad — Future Features Architecture Plan

> **Author:** Claude (solutions architect) · **For:** Bhargav · **Date:** 2026-06-04
> **Scope:** Feasibility + implementation architecture for the 5 post-MVP "Future Feature Ideas" (FI-1 … FI-5) in the [Nomad sprint board](file:///C:/DevBrain/wiki/projects/nomad-board.md).
> **Constraint:** Everything must stay inside the **current free tier** (no paid LLMs, no paid infra upgrades).
>
> This is a **planning document only** — no code has been changed. It analyses all four repos
> (`nomad-agent`, `nomad-api`, `nomad-web`, `nomad-mobile`) and proposes what to build, how, in what
> order, and what it costs.

---

## How to read this

Each feature gets a **verdict box** (feasible? effort? free-tier safe?), then a per-repo implementation
breakdown (`nomad-agent` / `nomad-api` / `nomad-web` / `nomad-mobile`), schema/API deltas, free-tier
impact, and risks. Effort uses the board's scale: **1 SP ≈ 1 hour of focused work.**

Jump to: [System snapshot](#1-system-snapshot) · [Free-tier budget](#2-free-tier-budget-the-binding-constraint) · [Build order](#3-dependency-graph--recommended-build-order) · [FI-5](#fi-5--in-trip-companion-today-view) · [FI-3](#fi-3--save--edit-trip-excel-like-ui) · [FI-1](#fi-1--itinerary-personalization-loop) · [FI-2](#fi-2--lock-places) · [FI-4](#fi-4--in-trip-expense-tracker) · [Roadmap](#6-consolidated-roadmap) · [Open decisions](#7-open-decisions-for-bhargav)

---

## 1. System snapshot

What exists today, verified by reading the repos (not from memory).

### 1.1 Repos & runtimes

| Repo | Stack | Role | Deploy |
|------|-------|------|--------|
| `nomad-agent` | Python 3.12 · FastAPI · LangGraph · Pydantic v2 | Multi-agent research + synthesis pipeline | Railway |
| `nomad-api` | Node 20 · Express v5 · Prisma · Zod | Auth / CRUD / polling | Railway |
| `nomad-web` | Next.js (App Router) · Tailwind v4 | Web frontend | Vercel |
| `nomad-mobile` | React Native · Expo SDK 55 · React Navigation v6 · Zustand | Mobile frontend | local/dev (no store build) |

The two backends **share one Supabase Postgres DB**. Node owns the schema (`prisma/schema.prisma`); the
agent reads/writes the same tables via `supabase-py` using raw snake_case column names. **Cross-service
comms are DB-mediated** — the agent makes *no* HTTP calls back to Node. Node → agent is one fire-and-forget
`POST /agent/research` returning `202`.

### 1.2 Data model (current)

```
Profile 1──N Trip 1──N ItineraryDay 1──N Stop
                 └──1 ResearchJob
TrendingCache (standalone, one row per season)
```

Key columns relevant to the future features:

- **`Stop`**: `id, dayId, tripId, sortOrder, time, ampm, duration, name, description, source, tags[], locked (default false), updatedAt`
  → **`locked` already exists.** **No `visited` column.**
- **`Trip.status`**: `'researching' | 'ready' | 'active' | 'completed' | 'archived'` — `active`/`completed` already modelled.
- **No** `Expense` / `ExpenseSplit` / `TripMember` models exist.

### 1.3 Agent pipeline (LangGraph)

`app/graph/pipeline.py` compiles this eagerly at import:

```
START → signals → ├─ geo ─────────────────────────────┐
                  └─ research_gate ─→ [youtube,         │
                                       youtube_longform,│
                                       reddit, google]  │ (parallel)
                                          → merge ──────┴→ synthesizer → END
```

- **`run_pipeline(trip_params: TripParams)`** is the single entry point. Input is **only** `TripParams` —
  it does *not* take an existing itinerary or user feedback.
- **L1 Redis cache** (`research_gate_node` + `app/cache.py`): on a **cache HIT** for a destination, all four
  research agents **no-op** and `merge` reuses the cached discovery pool. → **Re-running the pipeline for the
  same destination skips all external research** and costs ~1 synthesizer LLM call. *This is the key enabler
  for FI-1.*
- **Idempotent writes**: `supabase_writer.write_itinerary(trip_id, …)` deletes existing days+stops, then
  rewrites (cascade covers stops). Re-running never duplicates rows — **but stop IDs change.**
- LLMs are **model-agnostic** via `app/llm/factory.py` (`get_llm("<role>")`). Free-tier roles run on
  **Cerebras Qwen-3-235B** (1M tok/day free) and **Groq Llama-3.3-70B**; provider/model per role is an env
  var (`LLM_<ROLE>_PROVIDER` / `_MODEL`). Adding a new role = one mapping row + two env vars.

### 1.4 Current API surface (`nomad-api`, base `/api/v1`)

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/trips` | create + fire research worker |
| `GET` | `/trips` | **supports `?status=` filter already** |
| `GET` | `/trips/:id` · `/trips/:id/full` | summary · full (days+stops) |
| `PATCH` | `/trips/:id` | currently only `status` |
| `DELETE` | `/trips/:id` | |
| `PATCH` | `/trips/:id/stops/:stopId` | accepts **`{locked, name, description, time, ampm}`** only |
| `DELETE` | `/trips/:id/stops/:stopId` | |
| `GET` | `/trips/:id/research` | poll research job |
| `GET` | `/trending` | seasonal cache |

**Gaps for the future features:** no add-stop (`POST /stops`), no `duration`/`tags`/`sortOrder`/`dayId` in the
stop PATCH, no `visited`, no refine endpoint, no expenses/members endpoints.

### 1.5 Frontend surfaces

- **Web** (`nomad-web/app/(app)/`): `home`, `plan`, `profile`, `trips` (list), `trips/[id]` (itinerary
  reveal — read-only `PostcardCard`s + `OverviewCard`), `trips/[id]/researching`. **No "Today" view.**
- **Mobile** (`nomad-mobile/src/screens/`): `Home`, `MyTrips`, `PlanTrip`, `Profile`, `ItineraryReveal`,
  `ResearchTicker`, `InTripCompanion`. The **"Today" tab is already wired** in `MainTabNavigator` →
  `InTripCompanion`, but the screen is a **stub** ("Today / Coming soon"). The itinerary design spec already
  defines a per-stop **context menu (Lock / Swap / Move / Remove)** and a per-day **regen button** — i.e. the
  UI affordances for FI-1/FI-2/FI-3 are partly specced.

---

## 2. Free-tier budget (the binding constraint)

| Resource | Free limit | Used by | Impact of FI-1…FI-5 |
|----------|-----------|---------|---------------------|
| Cerebras Qwen-3-235B | ~1M tokens/day | synthesizer, trending | **FI-1 refine** adds ~1 call/refine (~5–15k tok). Even 100 refines/day ≪ 1M. ✅ |
| Groq Llama-3.3-70B | generous RPM free | research agents (fallback/refiner) | No new research calls (cache reuse). ✅ |
| YouTube Data API v3 | 10k units/day | youtube agents | **No new calls** — FI-1 reuses cached pool. ✅ |
| Tavily | 1000 searches/mo | google_blog agent | No new calls. ✅ |
| Reddit JSON / OSM Nominatim / Wikipedia | free, rate-limited | reddit/geo/images | No new calls. ✅ |
| Upstash Redis (L1 cache) | ~10k cmd/day free | research cache | FI-1 adds a few reads/refine. ✅ |
| Supabase Postgres | 500 MB DB, 5 GB egress, 50k MAU | everything | FI-4 adds 3 tiny tables; FI-5 adds 1 bool. Rows are kilobytes. ✅ |
| Railway (2 services) | hobby/usage-capped | api + agent | New endpoints are lightweight; FI-1 adds one LLM-latency request. ✅ |
| Vercel | hobby | web | Static/SSR pages, no cost change. ✅ |

**Verdict: all five features fit the free tier.** The only feature that *touches* the LLM budget is FI-1, and
because the research cache makes re-synthesis a cache HIT, each refine is a single small LLM call — orders of
magnitude under the daily cap. FI-3, FI-4, FI-5 are pure CRUD + UI (zero incremental AI/external cost).

> **One watch-item:** Railway hobby tier is usage-capped, not unlimited. None of these features change the
> steady-state load materially, but if you later move trending/refine to a cron or open the app publicly,
> re-check Railway minutes.

---

## 3. Dependency graph & recommended build order

```
FI-5 (Today view)      ── independent ───────────────┐
FI-3 (Edit trip)       ── independent ──┐            │
FI-1 (Personalize loop)── keystone ─────┼─→ FI-2 (Lock) [needs a re-gen to respect]
FI-4 (Expenses)        ── independent ──┘            │
```

- **FI-2 is not independently shippable** — a lock only has meaning once *something re-generates* the
  itinerary (FI-1). Build it as a rider on FI-1.
- **FI-1 is the keystone** and the strongest portfolio story ("AI concierge that iterates"), but not the
  cheapest. FI-3/FI-4/FI-5 are independent verticals.

**Recommended order** (cheapest-first, each shippable on its own, value-dense early):

| # | Feature | Why this slot | Effort |
|---|---------|---------------|--------|
| 1 | **FI-5 Today View** | Smallest. Mobile tab + stub already exist; backend filter exists. Fast win. | ~4 SP |
| 2 | **FI-3 Edit Trip** | Backend ~60% there; pure CRUD; unlocks "power editing" UX. | ~8 SP |
| 3 | **FI-1 Personalization Loop** | Flagship AI feature; reuses cache so it's cheap; needs new refine path. | ~9 SP |
| 4 | **FI-2 Lock Places** | Rides on FI-1 (refiner respects `locked`). Tiny. | ~2 SP |
| 5 | **FI-4 Expense Tracker** | Largest net-new surface; independent; do when you want non-AI breadth. | ~7–12 SP |

---

## FI-5 — In-Trip Companion (Today View)

> **Verdict:** ✅ **Feasible · Smallest · Free-tier safe.** ~4 SP. Mobile is ~70% scaffolded (tab wired,
> stub screen). Backend reuses the existing `?status=active` filter; only a one-column migration is needed.

**Goal:** A "while you're on the trip" surface — today's stops in chronological order with a *mark as
visited* checkbox.

### What to implement
A `Stop.visited` flag, a way to find the active trip + compute "today", and a Today screen on both platforms.

### How — per repo

**`nomad-api`** (DB + tiny API)
- **Schema migration** — add to `Stop`:
  ```prisma
  visited Boolean @default(false)
  ```
  (snake_case `@map` not needed — column is already camelCase-free; follow the repo's hand-rolled SQL migration
  convention in `supabase/migrations/`, run via Supabase SQL Editor, then `npx prisma generate`.)
- **Extend `updateStopSchema`** in `src/routes/trips.ts` to accept `visited: z.boolean().optional()` so the
  existing `PATCH /trips/:id/stops/:stopId` persists the checkbox. `tripService.updateStop` already passes
  through the validated patch — no service change beyond allowing the field.
- **Reuse** `GET /trips?status=active` (already implemented) to fetch the active trip. *(Optional convenience
  endpoint `GET /trips/:id/today` deferred — the client can compute "today's day" from `trip.dateFrom` + day
  offset.)*

**`nomad-web`** (new page + nav)
- New route `app/(app)/today/page.tsx`: fetch active trip (`GET /trips?status=active`) → `GET /trips/:id/full`
  → compute the `ItineraryDay` whose date == today (from `dateFrom` + `dayNumber-1`) → render stops
  chronologically with a visited checkbox (`PATCH …/stops/:id { visited:true }`, optimistic).
- Add a nav entry in `app/(app)/layout.tsx`. Add a **"no active trip" empty state**.

**`nomad-mobile`** (fill the stub)
- Implement `src/screens/InTripCompanion.tsx` (currently "Coming soon"). The **"Today" tab is already in
  `MainTabNavigator`** — no nav work. Reuse `ActiveTripCard`, `PostcardCard`/`TripCard`, theme tokens, and the
  `useRefetchOnFocus` pattern. Mark-visited = `PATCH` via `src/lib/api.ts`.

### Free-tier impact
**Zero.** One boolean column; pure CRUD reads/writes.

### Risks & mitigations
- *No trip dates / between trips* → show empty state; guard the date math against null `dateFrom`.
- *Timezone* → compute "today" in the trip's local date, not UTC, to avoid off-by-one at midnight.
- *Denormalized `stopCount`* unaffected (visited doesn't change counts).

---

## FI-3 — Save & Edit Trip (Excel-like UI)

> **Verdict:** ✅ **Feasible · Medium · Free-tier safe.** ~8 SP. Backend is ~60% done (PATCH stop already
> edits name/description/time/ampm). No agent or external-API involvement. Pure CRUD + an editable UI.

**Goal:** An "edit mode" where every stop detail is editable (name, time, duration, description, tags, day,
order), saved back to the backend — feels like a spreadsheet/structured form.

### What to implement
Round out the stop CRUD surface, add custom-stop creation + reorder + move-between-days, and an editable
grid UI.

### How — per repo

**`nomad-api`** (extend CRUD)
- **Extend `updateStopSchema`** (`src/routes/trips.ts`) with the missing editable fields:
  ```ts
  duration: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
  dayId: z.string().uuid().optional(),   // move stop to another day
  ```
  When `dayId` changes, **validate the target day belongs to the same trip** (ownership) before update.
- **New endpoint** `POST /trips/:id/stops` — add a custom stop. Body: `{ dayId, name, time, ampm, duration,
  description?, tags?, sortOrder? }`, `source` defaults to `'maps'`. In `tripService.createStop`: verify trip
  + day ownership, insert, bump `ItineraryDay.stopCount`.
- **(Optional)** `PATCH /trips/:id/days/:dayId` to edit day `title`/`description`/`city`/`highlights`.
- **Stats** (`Trip.statsPlaces/statsTips/statsPhotoStops`) are denormalized — recompute on add/delete stop,
  or accept minor drift for v1 (document the choice).

**`nomad-web`** (edit mode)
- On `app/(app)/trips/[id]/page.tsx`: an **"Edit" toggle** that swaps the read-only `PostcardCard` list for an
  editable per-day grid (`EditableDayTable`): inline field edits, add-stop row, drag-to-reorder
  (→ `sortOrder` PATCH), move-to-day control. Save = `PATCH` per dirty stop (or batched). **Disable
  `useRefetchOnFocus` while editing** so a focus event can't clobber unsaved edits.

**`nomad-mobile`**
- Editable variant of the postcard. The design spec's **context menu (Lock / Swap / Move / Remove)** maps
  directly: *Move* = change `dayId`/`sortOrder`, *Remove* = `DELETE` stop, *edit* = `PATCH`. Add an
  add-stop affordance per day.

### Free-tier impact
**Zero.** Pure database CRUD.

### Risks & mitigations
- *Refetch-on-focus overwriting edits* → disable in edit mode (above).
- *Cross-day move integrity* → server validates target day ∈ trip.
- *Stats drift* → recompute on mutation or accept for v1.
- *Pairs with FI-2* → "lock before edit" means a future re-gen won't undo manual edits.

---

## FI-1 — Itinerary Personalization Loop

> **Verdict:** ✅ **Feasible · Medium · Free-tier safe — and surprisingly cheap.** ~9 SP. The L1 research
> cache turns re-synthesis into a single small LLM call (cache HIT → no external research). This is the
> highest-value portfolio feature ("AI concierge that iterates, not a one-shot generator").

**Goal:** After the initial itinerary, the user converses to refine it — "remove this stop", "more food on
Day 3", "I don't like beaches, try something else".

### Design decision: targeted *refine*, not full re-research

Two options were considered:

| Approach | Cost | Churn | Verdict |
|----------|------|-------|---------|
| **A. Refine node** — one LLM call: `(current itinerary + instruction + locked stops + cached discovery pool) → patched itinerary` | 1 small LLM call | Low (preserves what user liked) | **Chosen** |
| B. Full pipeline re-run with augmented params | cache HIT ⇒ still ~1 synth call, but regenerates everything | High (re-shuffles unlocked stops) | Fallback only |

Approach **A** is cheaper, lower-churn, and naturally respects locked stops. It reuses the **cached discovery
pool** (`cache.get_cached_research(destination)`) so "try something else" has real alternative candidates
*without re-hitting YouTube/Reddit/Tavily*.

### How — per repo

**`nomad-agent`** (new refine path — follows the existing agent/route patterns)
- **`app/schemas.py`** — add `RefineRequest`:
  ```python
  class RefineRequest(BaseModel):
      trip_id: str
      destination: str
      instruction: str                 # the user's refinement ask
      current_itinerary: AIItinerary   # current state = the "memory" (stateless multi-turn)
      locked_stop_ids: list[str] = []
  ```
  Output reuses `AIItinerary`.
- **`app/agents/refiner.py`** — `run_refiner(req, signals, discovery_pool) -> AIItinerary` using
  `get_structured_llm("refiner", AIItinerary)`. Prompt: "Apply this change to the itinerary. **Never modify or
  remove stops in `locked_stop_ids`** — echo them unchanged at their day/time. Prefer alternatives from the
  provided discovery pool. Keep day count and untouched days stable." Pull `discovery_pool` from the L1 cache.
- **LLM factory** — add role `"refiner"` to `_resolve_role` + `LLM_REFINER_PROVIDER` / `_MODEL` in
  `app/config.py` (default to a **free** provider — Cerebras Qwen or Groq). *(Per repo rules: editing
  `schemas.py`/agents triggers the `schema-sync-checker` + `pipeline-reviewer` subagents — mirror any schema
  change in Node's Zod.)*
- **`app/routes/refine.py`** — `POST /agent/refine` (gated by `verify_internal_secret`), `BackgroundTask`
  `_refine_and_persist` → `run_refiner` → `supabase_writer.write_itinerary` (idempotent delete+rewrite) →
  `mark_trip_ready`. Reuse the existing progress-pacer pattern from `research.py` so the FE can animate.
- **No LangGraph graph needed** — single LLM call, like the trending agent. Stateless: the *current
  itinerary* IS the conversation state, so no new table is required for v1.

**`nomad-api`** (thin proxy + ownership)
- **New endpoint** `POST /trips/:id/refine` (auth + ownership). Body `{ instruction: string }`. Load
  `getTripFull`, derive `locked_stop_ids` (stops where `locked=true`), build `RefineRequest`, fire
  fire-and-forget `POST ${AGENT_SERVICE_URL}/agent/refine` with `X-Internal-Secret` (mirror
  `research.worker.ts`). Flip `ResearchJob.status`/`Trip.status` so the FE polls the **existing**
  `GET /trips/:id/research` for progress. Return `202`.
- **Guard**: only allow refine when `trip.status === 'ready'` (avoid colliding with an in-flight research job).

**`nomad-web`**
- On the trip detail page: a **refine panel** (slide-over / bottom sheet) with a chat input. Submit →
  `POST /trips/:id/refine` → reuse the research polling/skeleton UI → on `completed`, refetch `/full` and
  (optionally) highlight changed stops.

**`nomad-mobile`**
- Same as a bottom sheet over `ItineraryReveal`. The spec's per-day **regen button** = freeform refine;
  per-stop **Swap** = a scoped "replace this one stop" refine.

### Free-tier impact
**~1 LLM call per refine** on a free provider; **no external research calls** (cache reuse). Negligible vs the
1M tok/day Cerebras budget.

### Risks & mitigations
- **Stop IDs change** on rewrite (delete+rewrite writer). → For v1, the FE simply **refetches** `/full`
  (no client-side diff needed). If you want stable IDs / true diffing later, add a *merge-write* mode to
  `supabase_writer` (update existing rows by id, insert new, delete removed) — more work, deferred.
- **Locked stops must survive** → the refiner echoes them verbatim with `locked: true`; the normal rewrite
  then re-persists them (this is exactly the FI-2 contract).
- **Concurrency** → status guard above.
- **Prompt safety** → cap instruction length; the structured output (`AIItinerary`) is schema-validated, so a
  bad LLM response fails closed and the route marks the job failed (existing pattern).

---

## FI-2 — Lock Places

> **Verdict:** ✅ **Trivial once FI-1 exists.** ~2 SP. No schema change (`Stop.locked` already exists). No
> free-tier impact. **Do not ship before FI-1** — a lock that nothing respects is dead UI (this is exactly why
> the board descoped it from the MVP).

**Goal:** Lock a stop so a re-synthesis/refine won't change or remove it.

### What's already done
- `Stop.locked` column (default false) ✅
- `PATCH /trips/:id/stops/:stopId { locked }` ✅
- Web `handleLockToggle` ✅ · Mobile context-menu "Lock" specced ✅

### What's missing (the *meaning*)
- The **refiner** (FI-1) must receive `locked_stop_ids` and treat them as immutable (already designed into
  FI-1's `nomad-api` proxy + `refiner.py` prompt).
- Frontend: make the lock state **visibly** mark a stop (ember border/bg per design tokens) and ensure locked
  stops are excluded from "swap/replace" actions.

### Free-tier impact
**Zero.**

### Risks
- Edge case: user locks *every* stop then asks to refine → refiner has nothing to change; return the
  itinerary unchanged with a gentle message. Handle in the refiner prompt + a FE toast.

---

## FI-4 — In-Trip Expense Tracker

> **Verdict:** ✅ **Feasible · Largest net-new surface · Free-tier safe.** Effort depends on scope:
> **~7 SP (single-owner, named members)** vs **~12 SP (full multi-user collaboration)**. No AI, no external
> APIs — pure data + UI. **Recommend the single-owner scope for v1.**

**Goal:** Log trip expenses, split them, and compute net settle-up ("Priya owes Bhargav ₹1,200").

### Scope decision (important)
"Who owes who" implies *members*. Full multi-user (invite real accounts, each logs their own, real-time sync)
pulls in invitations, sharing, and permissions — a sizeable subsystem. **For v1, recommend single-owner +
named members:** the trip owner adds member *names* (not real user accounts) and logs expenses against them.
Settle-up math is identical; you skip the entire invite/auth-sharing system. Upgrade to real multi-user in a
later phase.

### How — per repo

**`nomad-api`** (the bulk of the work)
- **Schema migration** — 3 new models:
  ```prisma
  model TripMember {
    id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    tripId    String   @map("trip_id") @db.Uuid
    profileId String?  @map("profile_id") @db.Uuid   // null = name-only member (v1)
    name      String
    createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
    trip      Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
    @@map("trip_members")
  }
  model Expense {
    id          String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    tripId      String         @map("trip_id") @db.Uuid
    paidById    String         @map("paid_by_id") @db.Uuid   // TripMember.id
    amount      Decimal        @db.Decimal(12, 2)
    currency    String         @default("INR")
    description String
    category    String?
    spentAt     DateTime       @default(now()) @map("spent_at") @db.Timestamptz
    splits      ExpenseSplit[]
    trip        Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
    @@map("expenses")
  }
  model ExpenseSplit {
    id        String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    expenseId String  @map("expense_id") @db.Uuid
    memberId  String  @map("member_id") @db.Uuid
    share     Decimal @db.Decimal(12, 2)
    expense   Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
    @@map("expense_splits")
  }
  ```
  Add `members Expense[]`/`expenses`/`TripMember[]` relations to `Trip` as needed.
- **New router `src/routes/expenses.ts`** (mount under `/trips/:id`):
  - `GET/POST /trips/:id/members`, `DELETE /trips/:id/members/:mid`
  - `GET/POST /trips/:id/expenses`, `PATCH/DELETE /trips/:id/expenses/:eid`
  - `GET /trips/:id/settle` → net balances + minimal-transaction settle-up.
  - All auth + trip-ownership gated.
  - *(Per repo rules: editing `src/routes/**` auto-triggers the `api-contract-reviewer` agent.)*
- **`src/services/expense.service.ts`** — CRUD + a **pure, unit-testable settle-up function**: per member
  `net = Σpaid − Σowed`, then greedy match debtors↔creditors to minimise transactions.

**`nomad-web` / `nomad-mobile`**
- New **"Expenses" section/tab** on the trip detail screen: members list, add-expense modal (amount, payer,
  description, split = equal/custom), expense feed, and a **settle-up summary** with one-tap "mark settled".
- Mobile mirrors the same; reuse cards/forms/theme.

### Free-tier impact
**Zero.** Tiny rows in Supabase (well under 500 MB); no LLM, no external calls. *(Receipt-photo OCR — a
possible v2 — would need a vision model and is **not** trivially free-tier; explicitly out of scope here.)*

### Risks & mitigations
- **Scope creep into multi-user** → hold the line at single-owner + named members for v1 (above).
- **Money precision** → use `Decimal(12,2)`, never floats; do settle-up in integer minor units (paise/cents).
- **Currency** → single trip currency for v1; multi-currency conversion deferred.

---

## 5. Cross-cutting concerns

1. **Schema contract is dual-owned.** Any column change must be mirrored: Prisma (`nomad-api`) ⇄
   `app/schemas.py` + `supabase_writer.py` (`nomad-agent`) ⇄ Zod (`nomad-api` routes). Mismatches fail
   *silently* (Supabase drops the bad row). FI-1 (RefineRequest/AIItinerary) and FI-5 (`visited`) both touch
   this contract. The agent repo has `schema-sync-checker` + `pipeline-reviewer` subagents that auto-fire on
   `schemas.py`/`supabase_writer.py`/agent edits — let them run.
2. **Migrations are hand-rolled SQL.** The project does **not** use `prisma migrate` in prod (the `db:migrate`
   script is a vestige). Follow the SA-8 precedent: write `supabase/migrations/<date>_<name>.sql`, run it in
   the Supabase SQL Editor, then `npx prisma generate`. Coordinate per
   `nomad-agent/.claude/rules/db-contract.md`.
3. **Feature branches only.** `main` merge auto-deploys both Railway services + Vercel. One branch per feature
   (e.g. `feat/today-view`, `feat/trip-editing`, `feat/personalization-loop`, `feat/expense-tracker`).
4. **Web-first, then mobile parity.** Matches the established strategy: prove each feature on `nomad-web`,
   then port to `nomad-mobile`.
5. **Hardening prerequisites (board SB-1/SB-2, still ⬜).** Before opening any of these to real users, land
   rate-limiting (esp. on the new `/refine` and `/expenses` POSTs), CORS lock-down, pagination, and the
   client `console.log`/secret audit. FI-1's `/refine` is a new LLM-spend surface — **rate-limit it.**
6. **`graphify` is wired** in all three in-scope backend/web repos (`graphify-out/` + auto-update Stop hook).
   Keep it fresh after edits (`graphify update .`).

---

## 6. Consolidated roadmap

| Order | Feature | Agent | API | Web | Mobile | New external cost | Effort |
|-------|---------|:----:|:---:|:---:|:------:|-------------------|-------:|
| 1 | **FI-5 Today View** | — | `visited` col + PATCH field | new `today` page + nav | fill stub (tab exists) | none | **~4 SP** |
| 2 | **FI-3 Edit Trip** | — | extend stop PATCH, add `POST /stops`, (day PATCH) | edit-mode grid | editable cards + context menu | none | **~8 SP** |
| 3 | **FI-1 Personalize Loop** | `refiner.py` + `/agent/refine` + role | `POST /trips/:id/refine` proxy | refine chat panel | refine bottom sheet | ~1 free LLM call/refine | **~9 SP** |
| 4 | **FI-2 Lock Places** | refiner honors `locked` | feeds `locked_stop_ids` | visible lock state | context-menu lock | none | **~2 SP** |
| 5 | **FI-4 Expense Tracker** | — | 3 models + `expenses` router + settle-up | expenses tab + settle UI | expenses tab | none | **~7–12 SP** |

**Totals:** ~30–35 SP for all five (single-owner FI-4). At the board's ~8–10 SP/week cadence, that's roughly
**3–4 weeks** of evenings+weekends — but each is independently shippable, so you can stop after any one.

**Suggested grouping into branches/mini-sprints**
- *Quick wins:* FI-5 → FI-3 (both pure CRUD/UI, no agent risk).
- *AI showcase:* FI-1 + FI-2 together (one branch — lock is meaningless without refine).
- *Breadth vertical:* FI-4 last, scoped to single-owner.

---

## 7. Open decisions for Bhargav

1. **FI-4 scope** — single-owner + named members (recommended, ~7 SP) **or** full multi-user collaboration
   with invites (~12 SP + a sharing/permissions subsystem)?
2. **FI-1 stop identity** — accept changing stop IDs on refine + FE refetch (recommended, simplest) **or**
   invest in a merge-write path for stable IDs / inline diffing?
3. **FI-1 multi-turn memory** — stateless (current itinerary = state, recommended) **or** persist a
   `refinement_messages` log for a true chat transcript?
4. **Portfolio priority** — if the goal is the strongest interview story, **FI-1 + FI-2** is the headline
   ("multi-agent system that iterates with the user"). If the goal is breadth, **FI-4** shows full-stack
   product range. Which do you want first?
5. **Hardening gate** — land SB-1/SB-2 before or alongside these (esp. rate-limiting `/refine`)?

---

*Generated from a read-through of all four repos on 2026-06-04. No code was modified. File lives in
`nomad-web/` per request; the canonical feature backlog remains the
[Nomad sprint board](file:///C:/DevBrain/wiki/projects/nomad-board.md) (FI-1…FI-5).*
