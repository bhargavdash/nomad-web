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
