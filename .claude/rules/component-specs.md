---
paths:
  - 'components/**'
---

# Nomad Web — Component Specs

> Visual and API specs for every component. Read before building or modifying any component.

---

## Primitive UI (`components/ui/`)

### `Button`
Props: `variant`, `size`, `loading`, `disabled`, `onClick`, `className`, `children`

| Variant | Style |
|---|---|
| `accent` | bg `--color-ember`, white text, ember-hover shadow on hover |
| `primary` | bg `--color-navy`, white text |
| `outline` | border `--color-border-soft`, ink text |
| `ghost` | no border, muted text, ink text on hover |

| Size | Height | Font |
|---|---|---|
| `lg` | 52px | `text-[15px]` DM Sans medium |
| `md` | 44px | `text-[14px]` DM Sans medium |
| `sm` | 36px | `text-[13px]` DM Sans medium |

- All buttons: `rounded-[100px]` (pill)
- `loading` prop shows a spinner, disables interaction
- `disabled` prop lowers opacity to 0.5

### `Input` / `TextArea`
- Border: `1.5px solid var(--color-border-soft)`, radius `rounded-[14px]`
- Focus: `1.5px solid var(--color-ember)` + subtle ember glow ring
- Font: DM Sans 14px, ink colour
- Placeholder: muted colour

### `Dialog`
- Backdrop: `bg-black/40 backdrop-blur-sm`
- Panel: `bg-white rounded-[24px] p-8 shadow-context-menu`
- `DialogTitle`: Playfair Display, 24px, ink
- `DialogDescription`: DM Sans 14px, muted

### `Popover`
- Panel: `bg-white rounded-[20px] border border-[--color-border-soft] shadow-card p-4`

---

## Brand components (`components/brand/`)

### `KeywordChip`
Props: `label`, `active`, `onClick`, `variant?`

- Inactive: `border-[1.5px] border-[--color-border-soft] bg-white text-ink`
- Active: `border-[1.5px] border-[--color-navy] bg-[--color-navy] text-white`
- `variant="terracotta"` active: `border-[--color-ember] bg-[--color-ember] text-white`
- Shape: `rounded-[100px] px-4 py-2 text-[13px] DM Sans medium`

### `ActiveTripCard`
Props: `destination`, `dateFrom`, `dateTo`, `duration`, `stats`, `href`

- Background: dark navy (`--color-navy`) with ember gradient overlay
- Title: Playfair Display 24px white
- Stats row: DM Mono 11px white/55
- Shadow: `.shadow-active-trip`
- Status badge: sage bg `rgba(42,122,86,0.25)`, text `#5DD4A8`

### `DestinationCard`
Props: `name`, `country`, `duration`, `signal`, `query`

- Fixed width (horizontal scroll): `w-[280px] shrink-0`
- Background: Unsplash image via `lib/unsplash.ts`, dark gradient overlay
- Title: Playfair Display 20px white
- Meta: DM Mono 10px white/55 uppercase

### `HeroCTACard`
- Shown when no active trip. Links to `/plan`.
- Cream background with ember accent CTA button.

### `InsightCard`
Props: `icon`, `title`, `body`, `source`, `destTag`

- White card, `.shadow-card`, `rounded-[18px]`
- Icon: emoji or Lucide icon in ember-light bg circle
- Title: Playfair 16px ink (`.text-card-title-s`)
- Body: DM Sans 13px muted
- Source badge at bottom

### `SourceBadge`
Props: `source` — `"youtube" | "reddit" | "blog" | "maps"`

| Source | Bg colour | Label |
|---|---|---|
| `youtube` | `--color-yt` | `▶ YouTube` |
| `reddit` | `--color-reddit` | `r/ Reddit` |
| `blog` | `--color-blog` | `✍ Blog` |
| `maps` | `--color-maps` | `📍 Maps` |

- Shape: `rounded-[100px] px-2.5 py-1 text-[10px] DM Mono uppercase text-white`

### `UserAvatar`
Props: `url?`, `name`, `email?`, `size?`

- Shows `<Image>` when `url` present, else initials circle
- Initials circle: `--color-ember` bg, white text, Playfair Display

### `NomadLogo`
- SVG wordmark. No external dependency.

---

## Itinerary components (`components/itinerary/`)

### `PostcardCard`
Props: `stop: TripStop`, `onLockToggle`, `onRemove`, `exiting`

- Dark background: `--color-card-dark`
- Stop name: Playfair Display 20px white
- Description: DM Sans 14px white/55
- Tags: ember-light bg, ember-dim text chips
- Source badge bottom-left
- Lock icon (Lucide `Lock`/`Unlock`) top-right — toggles `stop.locked`
- Remove button: red ghost icon
- `exiting` prop: fade/slide-out animation via Framer Motion

---

## Layout components (`components/layout/`)

### `TopNav`
- Height: 72px
- Logo left, nav links centre, avatar right
- Background: white with `border-b border-[--color-border-soft]`
- Sticky: `sticky top-0 z-30`

### `StaggerSection`
Props: `index`, `className?`, `children`

- Wraps children in a Framer Motion `motion.div` with stagger delay based on `index`
- Entry: `opacity: 0, y: 16` → `opacity: 1, y: 0`
- Delay: `index * 0.08s`
- Use on every major page section for consistent page-load feel

### `AuthShell`
- Centered column layout for sign-in / sign-up pages
- Dark navy background

---

## Plan components (`components/plan/`)

### `LocationSearchInput`
Props: `value: string`, `onSelect: (value: string) => void`

- Uses `usePhotonSearch` hook (Photon Komoot geocoder API)
- Dropdown: white card, shadow-card, results as rows
- Each row: place name + country, DM Sans 14px
- Debounced 300ms, min 2 chars

### `DateRangePopover`
Props: `value: DateRange`, `onChange: (dates: DateRange) => void`

- Trigger button shows formatted date range or placeholder
- Popover contains a calendar date-range picker
- Date format display: `MMM d` via `date-fns`

### `AccommodationGrid`
Props: `value: AccommodationType | null`, `onChange: (value: AccommodationType) => void`

- Grid of accommodation type cards with icons
- Selected state: ember border + bg tint
- Options: Boutique Villa, Luxury Hotel, Eco Lodge, Homestay, Airbnb, Hostel, Custom Stay
