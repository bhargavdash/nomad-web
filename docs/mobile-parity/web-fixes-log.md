# Web Fixes → Mobile Parity Log

Track fixes made to `nomad-web` that need to be replicated in `nomad-mobile`.
Once a batch is ready to port, use this doc as the spec for the mobile work.

---

## Fix 1 — Pace & Budget: default values + no-deselect behavior

**Date:** 2026-06-08
**Web files changed:**
- `store/tripPlanStore.ts`
- `app/(app)/plan/page.tsx`

**What changed:**

1. **Default values set in store initial state:**
   - `pace` now initialises to `"Balanced"` (was `null`)
   - `budget` now initialises to `"Medium"` (was `null`)
   - These match the backend fallbacks in `nomad-api/src/workers/research.worker.ts` (`pace ?? 'Balanced'`, `budget ?? 'Medium'`)

2. **Types made non-nullable:**
   - `pace: PaceType` (was `PaceType | null`)
   - `budget: BudgetTier` (was `BudgetTier | null`)
   - `setPace(value: PaceType)` and `setBudget(value: BudgetTier)` no longer accept `null`

3. **No-deselect chip behavior:**
   - Pace and Budget chips now only switch selection — tapping an already-active chip does nothing
   - Previously tapping the active chip would set the value to `null` (unselect), which caused the backend to silently fail with an unexpected null
   - Vibes chips are unaffected (multi-select toggle behavior intentional)

**Mobile replication notes:**
- Find the equivalent Zustand store slice for `pace` and `budget` in `nomad-mobile`
- Set the same initial values: `pace: 'Balanced'`, `budget: 'Medium'`
- Update the chip/selector press handlers on the Plan screen so pressing an already-active option is a no-op
- Remove `null` from the TypeScript types for these two fields in the mobile store

---

## Fix 2 — Accommodation: default value + non-nullable type

**Date:** 2026-06-08
**Web files changed:**
- `store/tripPlanStore.ts`
- `components/plan/AccommodationGrid.tsx`

**What changed:**

1. **Default value set in store initial state:**
   - `accommodation` now initialises to `"Budget Hotel"` (was `null`)
   - Matches the backend fallback in `nomad-api/src/workers/research.worker.ts` (`accommodation ?? 'Budget Hotel'`)

2. **Types made non-nullable:**
   - `accommodation: AccommodationType` (was `AccommodationType | null`)
   - `setAccommodation(value: AccommodationType)` no longer accepts `null`
   - `AccommodationGrid` prop `value: AccommodationType` (was `AccommodationType | null`)

3. **Behavior:**
   - AccommodationGrid already used `role="radiogroup"` — clicking a row always calls `onChange(label)`, never null. No deselect was ever possible from the component itself; the null initial state was the only issue.
   - With the default set, "Budget Hotel" is always pre-selected and the user switches between options.

**Mobile replication notes:**
- Find the accommodation state in the mobile plan store
- Set initial value: `accommodation: 'Budget Hotel'`
- Remove `null` from the type
- Verify the accommodation selector on the Plan screen does not allow deselect (radio-style behavior)

---

## Fix 3 — Trending India: show state/UT instead of "India"

**Date:** 2026-06-08
**Files changed:**
- `nomad-agent/app/agents/trending.py` — updated LLM prompt
- `nomad-api/prisma/seed.ts` — updated bootstrap seed data
- No frontend changes needed (`country` is already a plain string, `DestinationCard` renders it verbatim)

**What changed:**

1. **Agent prompt** (`trending.py`): The India list rule previously instructed the LLM to set `country: "India"` for every Indian destination. Updated to require the Indian state or union territory instead. The string `"India"` is now explicitly prohibited for India-list entries.

2. **Seed data** (`seed.ts`): Updated all 10 bootstrap India entries:
   | Place | Old country | New country |
   |---|---|---|
   | Goa | India | Goa |
   | Jaipur | India | Rajasthan |
   | Manali | India | Himachal Pradesh |
   | Udaipur | India | Rajasthan |
   | Rishikesh | India | Uttarakhand |
   | Hampi | India | Karnataka |
   | Pondicherry | India | Puducherry |
   | Spiti | India | Himachal Pradesh |
   | Munnar | India | Kerala |
   | Andaman Islands | India | Andaman & Nicobar Islands |

**DB steps required (choose one):**

- **Option A — Re-seed (updates bootstrap row):** From `nomad-api/`, run:
  ```
  npx prisma db seed
  ```
  This wipes the existing `trending_cache` table and re-inserts the bootstrap row with the corrected state/UT data. Any existing LLM-generated season rows are also wiped.

- **Option B — Agent refresh (preferred for production):** Trigger a seasonal refresh via:
  ```
  POST /agent/trending-refresh
  ```
  The updated prompt will generate a fresh payload with state/UT names for the current season. For Railway: hit the agent service URL with `Authorization: Bearer <INTERNAL_AGENT_SECRET>` and body `{"season_key": "winter-2026"}`.

> **Note on Goa:** Goa is both the place name and the state name, so the card will show "Goa / Goa". Technically correct but visually redundant. A future fix could suppress the country label when it matches the name, or use a sub-region. Left as-is for now.

**Mobile replication notes:**
- No mobile code changes needed — this fix is entirely in the data layer (agent prompt + seed)
- The updated `country` field will flow through to mobile automatically when the backend serves fresh data

---

## Fix 4 — Researching screen: remove fake polling stats grid

**Date:** 2026-06-08
**Web files changed:**
- `app/(app)/trips/[id]/researching/page.tsx`

**What changed:**

1. **Stats grid removed entirely** from the polling/research screen:
   - Removed the `grid grid-cols-3` block that showed "Places found", "Local tips", and "Photo stops" with animated numeric values
   - Removed the `Stat` helper component that rendered each number + label
   - Removed `stats` from the `useResearchPoller` destructuring

2. **Why:** The stats shown during polling were hardcoded fake values from `_PACER_STEPS` in the Python agent (`routes/research.py`) — they were animation filler, not real data. Real stats (computed from the actual itinerary) are shown correctly in the itinerary view (`/trips/[id]`). Showing fake incrementing numbers during research was misleading.

3. **What remains:**
   - The discovery card (shows real mid-flight discoveries from `merge_node`) stays
   - The progress bar + phase label stays
   - The source rows (YouTube / Reddit / Blogs / Maps scanning status) stay
   - The real stats (`statsPlaces`, `statsTips`, `statsPhotoStops`) are still shown in the itinerary view — no change there

**Mobile replication notes:**
- Find the equivalent of the researching/polling screen in `nomad-mobile` (the screen shown while the trip is being generated)
- If it shows a similar stats grid with place count / tip count / photo stop count during polling, remove it — those numbers are hardcoded animation filler, not real data
- The discovery card animation and progress indicator are genuine (real data from `merge_node`) and should be kept
- The real stats are available once the trip is ready; only show them on the itinerary/trip detail screen

---

## Fix 5 — Agent: pace, accommodation, and traveler count semantic enrichment

**Date:** 2026-06-08
**Web files changed:** None — this is a backend-only change in `nomad-agent`

**What changed (nomad-agent):**

1. **Pace semantic enrichment** (`app/agents/synthesizer.py`, `app/skills/synthesizer.md`):
   - Added `_PACE_HINT` dict — maps each pace value to behavioral guidance injected into the synthesizer voice cues:
     - `"Slow & Soulful"`: linger 2–3 h per stop, start ~2 h after sunrise, favour sit-in spots (cafés, gardens, markets)
     - `"Balanced"`: start ~1 h after sunrise, vary density day-to-day, always include a proper meal
     - `"Action-Packed"`: start at/within 30 min of sunrise, keep stops ≤ 1.5 h, feasibility check (total time + travel must fit before sunset)
   - Added P1–P3 pace rules to `synthesizer.md` as explicit system prompt rules — the LLM now enforces stop durations, day start times (relative to `geo_brief` sunrise), and feasibility for Action-Packed

2. **Accommodation semantic enrichment** (`synthesizer.py`, `synthesizer.md`):
   - Added `_ACCOMMODATION_HINT` dict — maps the 4 accommodation types to neighbourhood/context guidance:
     - `"Hostel"` → social/party area, cheap eats
     - `"Budget Hotel"` → functional base, street food
     - `"Airbnb / Homestay"` → local residential neighbourhood, morning market
     - `"Luxury Hotel"` → upscale base, hotel amenities (spa/pool/rooftop) are valid stop options
   - Added P4 rule: `stay_by_city` must match accommodation type; budget always caps spend

3. **Traveler count semantic enrichment** (`synthesizer.py`, `synthesizer.md`):
   - Added dynamic `travelers_hint` computed from the numeric count:
     - 1 → solo (solo-friendly spots, safety/logistics note)
     - 2 → couple (1–2 romantic moments woven in)
     - 3–4 → small group (venues that seat small groups)
     - 5+ → large group (capacity venues, booking notes)
   - Added P5 rule to `synthesizer.md` encoding these behaviours

**Mobile replication notes:**
- No mobile code changes needed — the enrichment happens entirely in the Python synthesizer agent
- The mobile app calls the same backend, so all trips generated after this commit automatically benefit from the improved pace, accommodation, and group-size handling
- Verify the mobile plan screen sends the correct string values: `travelers` as a numeric string (e.g. `"2"`), `accommodation` as exactly one of `"Hostel" | "Budget Hotel" | "Airbnb / Homestay" | "Luxury Hotel"`, `pace` as `"Slow & Soulful" | "Balanced" | "Action-Packed"`

---
