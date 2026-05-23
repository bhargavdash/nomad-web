---
paths:
  - 'app/**'
  - 'components/**'
---

# Nomad Web Design Tokens — Single Source of Truth

> Derived from `c:/Users/DELL/code/nomad/docs/nomad_design_spec.html`.
> All tokens live in `app/globals.css` under `@theme { }`.
> Never hardcode hex values — always use the CSS custom property.

---

## 1. Colour Tokens

### Primary

| CSS variable | Hex | Role |
|---|---|---|
| `--color-ember` | `#C4623A` | CTAs, active states, accent |
| `--color-ember-dim` | `#A84E2A` | Hover/pressed states |
| `--color-ember-light` | `#F5E8E0` | Tinted backgrounds, locked bg |
| `--color-peach` | `#E8A87C` | Secondary accent, orb pulse |
| `--color-peach-light` | `#FDF0E8` | Light peach tint |

### Navy / Dark surfaces

| CSS variable | Hex | Role |
|---|---|---|
| `--color-navy` | `#1B2B4B` | Primary dark, CTA bg |
| `--color-navy-2` | `#162340` | Darker surface |
| `--color-navy-3` | `#111820` | **Itinerary page background** |
| `--color-card-dark` | `#1C2634` | Dark card body |

### Warm cream backgrounds

| CSS variable | Hex | Role |
|---|---|---|
| `--color-cream` | `#F5F0E8` | App background (all light pages) |
| `--color-cream-2` | `#E8E0D0` | Progress bar track, filter bg |
| `--color-warm-white` | `#FDFAF5` | Search bar bg, Google SSO btn |

### Text

| CSS variable | Hex | Role |
|---|---|---|
| `--color-ink` | `#2A2520` | Primary body text |
| `--color-muted` | `#8A8070` | Secondary text, placeholders |
| `--color-border-soft` | `#DDD8CC` | Card borders, input borders, dividers |

### Functional

| CSS variable | Hex | Role |
|---|---|---|
| `--color-sage` | `#2A7A56` | Success states, blog badge |
| `--color-sage-light` | `#E0F0E8` | Success tinted bg |
| `--color-sky-blue` | `#2E6FAA` | Maps badge |
| `--color-sky-light` | `#E0EEF8` | Maps tinted bg |

### Source badge colours

| CSS variable | Hex | Role |
|---|---|---|
| `--color-yt` | `#E8593C` | YouTube badge |
| `--color-reddit` | `#FF4500` | Reddit badge |
| `--color-blog` | `#2A7A56` | Blog badge |
| `--color-maps` | `#2E6FAA` | Maps badge |

### Dark surface text hierarchy (on navy / `--color-navy-3` bg)

```
Title:      text-white
Body:       text-white/55
Meta:       text-white/45
Stat label: text-white/35
Border:     border-white/8
```

---

## 2. Typography

### Font families

| CSS variable | Font | Purpose |
|---|---|---|
| `--font-display` | Playfair Display | Headings, card titles, display |
| `--font-sans` | DM Sans | Body, UI labels, buttons |
| `--font-mono` | DM Mono | Numbers, time, progress %, eyebrows |

Loaded via `next/font/google` in `app/layout.tsx`, injected as `--font-playfair`, `--font-dm-sans`, `--font-dm-mono`.

### Type-scale utility classes

Use these classes instead of raw `font-size` values for headings and body text:

| Class | Font | Weight | Size | Line height |
|---|---|---|---|---|
| `.text-display-xl` | Playfair | 800 | 56px | 1.05 |
| `.text-display-l` | Playfair | 800 | 42px | 1.1 |
| `.text-display-m` | Playfair | 700 | 32px | 1.15 |
| `.text-display-s` | Playfair | 700 | 22px | 1.2 |
| `.text-card-title` | Playfair | 700 | 20px | 1.25 |
| `.text-card-title-s` | Playfair | 700 | 16px | 1.3 |
| `.text-body-l` | DM Sans | 400 | 17px | 1.6 |
| `.text-body-m` | DM Sans | 400 | 15px | 1.55 |
| `.text-body-s` | DM Sans | 400 | 14px | 1.55 |
| `.text-body-xs` | DM Sans | 400 | 13px | 1.55 |
| `.text-label-m` | DM Sans | 500 | 14px | 1.3 |
| `.text-label-s` | DM Sans | 500 | 12px | 1.3 |
| `.text-label-xs` | DM Sans | 500 | 11px | 1.3 + uppercase + tracking |
| `.text-mono-m` | DM Mono | 500 | 14px | 1.4 |
| `.text-mono-s` | DM Mono | 400 | 12px | 1.4 |
| `.text-mono-xs` | DM Mono | 400 | 10px | 1.4 + tracking |

### Special text utilities

- `.text-wander` — Playfair italic in `--color-ember`. Use on `<span>` inside a display heading for editorial accent.
- Eyebrow pattern: `font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]`
- Meta pattern: `font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]`

---

## 3. Border Radius

| Element | Value |
|---|---|
| Button / pill / chip | `rounded-[100px]` |
| Card (standard) | `rounded-[18px]` |
| Card (large) | `rounded-[20px]` |
| Input field | `rounded-[14px]` |
| Icon box | `rounded-[10px]` |
| Context menu / sheet | `rounded-[16px]` |

---

## 4. Shadows

Use the utility classes — never write raw `box-shadow` values:

| Class | Use |
|---|---|
| `.shadow-card` | Card at rest |
| `.shadow-card-hover` | Card on hover |
| `.shadow-postcard` | Postcard / hero card |
| `.shadow-fab` | Floating action button |
| `.shadow-active-trip` | Active trip card |
| `.shadow-context-menu` | Dropdown / context menu |
| `.shadow-ember-hover` | Ember-coloured CTA hover glow |

---

## 5. Page backgrounds

| Page | Background |
|---|---|
| Landing, Home, Plan, Profile | `bg-[var(--color-cream)]` (#F5F0E8) |
| Sign In, Sign Up | Dark navy |
| Itinerary (`/trips/[id]`) | `bg-[var(--color-navy-3)]` (#111820) |

---

## 6. Animations (keyframes defined in globals.css)

| Class | Keyframe | Use |
|---|---|---|
| `.animate-orb-pulse` | `orb-pulse` | Research page orb scale pulse |
| `.animate-orb-ring` | `orb-ring` | Research page expanding ring |
| `.animate-shake` | `shake` | Form validation error shake |

---

## 7. Layout constants

| Property | Value |
|---|---|
| Max content width | `max-w-[1440px]` |
| Max narrow content | `max-w-[680px]` (itinerary) |
| Page horizontal padding | `px-8` (32px) |
| Top nav height | `72px` |
| Scroll offset for sticky nav | `scroll-mt-[140px]` |
