> **Next.js warning:** This is NOT the Next.js you know. APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Nomad Web — Claude Code Development Guide

## What this app is

Nomad Web is the browser companion to the Nomad mobile travel-planning app. It lets users plan AI-generated, day-by-day itineraries via a web interface — same design language as the React Native app, different implementation.

## Design references

- **Figma:** https://www.figma.com/design/QYrQnWYO9ZI6yjMgLGPphC/Untitled
- **Mobile design spec (source of truth):** `c:/Users/DELL/code/nomad/docs/nomad_design_spec.html`
- **Design tokens:** `.claude/rules/design-tokens.md` (CSS custom properties, typography, shadows, spacing)
- **Component specs:** `.claude/rules/component-specs.md` (visual specs for every component)
- **Coding standards:** `.claude/rules/coding-standards.md` (always-loaded rules)

Priority order: Figma / HTML spec > design-tokens.md > this file.

---

## Tech stack

- **Framework:** Next.js (App Router) — read `node_modules/next/dist/docs/` before writing any Next.js code
- **Styling:** Tailwind CSS v4 with `@theme` CSS custom properties — **no** `tailwind.config.ts`
- **State:** Zustand
- **Auth + DB:** Supabase (`@supabase/ssr` for server-side, `@supabase/supabase-js` for client)
- **HTTP:** Axios (`lib/api.ts`) — auto-injects Supabase session token
- **Fonts:** `next/font/google` — Playfair Display, DM Sans, DM Mono
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Toasts:** Sonner
- **TypeScript:** strict mode — `noImplicitAny`, `useUnknownInCatchVariables` are ON

---

## App structure

```
app/
├── layout.tsx                  # Root layout — fonts, Toaster
├── globals.css                 # ALL design tokens live here as CSS custom properties
├── page.tsx                    # Landing page
├── (app)/                      # Authenticated shell (TopNav guard)
│   ├── layout.tsx
│   ├── home/page.tsx           # Post-auth home
│   ├── plan/page.tsx           # Trip planning form
│   ├── profile/page.tsx        # User profile
│   └── trips/[id]/
│       ├── page.tsx            # Itinerary view (dark #111820 bg)
│       └── researching/page.tsx # AI research phase (progress + discovery cards)
└── (auth)/                     # Pre-auth shell
    ├── layout.tsx
    ├── signin/page.tsx
    └── signup/page.tsx
```

---

## Component inventory

```
components/
├── brand/                      # Nomad-specific UI elements
│   ├── ActiveTripCard.tsx
│   ├── DestinationCard.tsx
│   ├── HeroCTACard.tsx
│   ├── InsightCard.tsx
│   ├── KeywordChip.tsx
│   ├── NomadLogo.tsx
│   ├── SourceBadge.tsx
│   └── UserAvatar.tsx
├── itinerary/
│   └── PostcardCard.tsx        # Individual stop card in itinerary
├── layout/
│   ├── AuthShell.tsx
│   ├── StaggerSection.tsx      # Framer Motion stagger wrapper
│   └── TopNav.tsx
├── plan/
│   ├── AccommodationGrid.tsx
│   ├── DateRangePopover.tsx
│   └── LocationSearchInput.tsx # Photon Komoot geocoder
└── ui/                         # Primitive components
    ├── button.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── popover.tsx
```

---

## Key stores

| Store | File | Purpose |
|---|---|---|
| `useAuthStore` | `store/authStore.ts` | Session, User, ApiProfile, signOut |
| `useTripPlanStore` | `store/tripPlanStore.ts` | All plan-form state (destination, dates, vibes, pace, budget…) |

---

## Key lib files

| File | Purpose |
|---|---|
| `lib/api.ts` | Axios instance pointing at `NEXT_PUBLIC_API_URL/api/v1`, auto-injects auth token |
| `lib/supabase/client.ts` | Singleton browser Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client (cookies) |
| `lib/unsplash.ts` | Generates Unsplash source URLs by query |
| `lib/utils.ts` | `cn()` — clsx + tailwind-merge |

---

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (defaults to `http://localhost:3000`) |

---

## TypeScript rules (critical)

- **`strict: true`** is on — never use implicit `any`
- Avoid `.then(({ param }) => …)` destructuring on untyped promises — use `async/await` instead for correct inference
- Catch variables are `unknown` — narrow with `instanceof Error` before accessing properties
- Type all `useState` calls that can't be inferred from the initial value

---

## File structure rules

```
nomad-web/
├── .claude/
│   ├── CLAUDE.md               # ← you are here
│   ├── rules/
│   │   ├── coding-standards.md # always-loaded universal rules
│   │   ├── design-tokens.md    # path-scoped — CSS variables & typography
│   │   └── component-specs.md  # path-scoped — component specs
│   ├── skills/
│   │   ├── build-component.md  # /build-component workflow
│   │   └── build-page.md       # /build-page workflow
│   └── settings.local.json
├── app/                        # Next.js App Router
├── components/                 # React components
├── data/                       # Placeholder/seed data
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities, API client, Supabase clients
├── store/                      # Zustand stores
└── types/                      # TypeScript type definitions (api.ts)
```

---

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain don't surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
