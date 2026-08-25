# nomad-web

The web frontend for the **Nomad** AI travel itinerary app. Next.js + Tailwind CSS v4. Deployed on Vercel. Shares the same two backends as the React Native app (`nomad-api` on Railway and `nomad-agent` on Railway).

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 (`@theme` custom properties — no `tailwind.config.ts`) |
| State | Zustand |
| Auth + DB | Supabase (`@supabase/ssr` server-side, `@supabase/supabase-js` client) |
| HTTP | Axios (`lib/api.ts`) — auto-injects Supabase session token |
| Fonts | Playfair Display + DM Sans + DM Mono (via `next/font/google`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | Sonner |

Design system: "Azure Horizon" — cream / ink / ember / navy palette, matching the React Native app.

---

## Getting started

```bash
npm install

# copy env template and fill in keys
cp .env.example .env.local

npm run dev
# → http://localhost:3000
```

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (defaults to `http://localhost:3000`) |

---

## App structure

```
app/
├── layout.tsx                      # Root layout — fonts, Toaster
├── globals.css                     # ALL design tokens as CSS custom properties
├── page.tsx                        # Landing page
├── (app)/                          # Authenticated shell (TopNav guard)
│   ├── home/page.tsx               # Post-auth home
│   ├── plan/page.tsx               # Trip planning form
│   ├── profile/page.tsx            # User profile
│   ├── trips/page.tsx              # My Trips list screen
│   └── trips/[id]/
│       ├── page.tsx                # Itinerary view
│       └── researching/page.tsx    # AI research phase (progress + discovery cards)
└── (auth)/                         # Pre-auth shell
    ├── signin/page.tsx
    └── signup/page.tsx
```

---

## Feature status

| Feature | Status | Notes |
|---------|--------|-------|
| Auth flow | ✅ | Google OAuth + email/password |
| PlanTrip form | ✅ | All 7 inputs wired to backend |
| ResearchTicker (polling) | ✅ | Live agent phases |
| ItineraryReveal | ✅ | Real AI-generated stops from prod |
| My Trips screen | ✅ | Lists all user trips with status |
| Profile screen | ✅ | |
| Stop management UI | 🔄 | Partially implemented, not fully integrated |
| InTripCompanion | ⬜ | Planned |
| Image handling | ⬜ | Deferred |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |

---

## Design reference

- **Figma:** see `.claude/CLAUDE.md` for the link
- **Design tokens:** `.claude/rules/design-tokens.md` (CSS custom properties, typography, shadows)
- **Component specs:** `.claude/rules/component-specs.md`
