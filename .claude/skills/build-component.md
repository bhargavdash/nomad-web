# Build Component — Nomad Web

Use this skill when asked to build, create, or modify a React component for the web app.

## Workflow

### Step 1 — Read the design system

Before writing any styles, read `.claude/rules/design-tokens.md` for exact token values and `.claude/rules/component-specs.md` for the component's visual spec. Never guess colours, shadows, or radii.

### Step 2 — Check `app/globals.css`

Confirm the CSS custom properties you'll need exist in `globals.css`. If you need a utility class (e.g. a new type scale), add it there — not inline.

### Step 3 — Find existing patterns

Before building from scratch, check `components/` for a similar component to match conventions. Especially check `components/ui/` for primitives and `components/brand/` for styled brand components.

### Step 4 — Build the component

Rules:
1. **File location**: `components/{brand|ui|itinerary|layout|plan}/ComponentName.tsx`
2. **TypeScript**: Define props interface above the component. Use strict types — no `any`.
3. **Styling**: Tailwind classes only. Use `cn()` from `lib/utils.ts` for conditional classes.
4. **Tokens**: Reference via `text-[var(--color-X)]`, `bg-[var(--color-X)]`, `border-[var(--color-X)]` — never hardcode hex values.
5. **Client vs Server**: Add `"use client"` only if the component uses hooks, events, or browser APIs.
6. **Animation**: Use Framer Motion for enter/exit animations. CSS keyframes in `globals.css` for continuous loops.
7. **Fonts**: Use type-scale utility classes (`.text-display-m`, `.text-body-s`, etc.) for headings and named text styles. Raw `text-[14px]` is acceptable for one-off sizes.

### Step 5 — Validate

- [ ] Colours match design-tokens.md exactly (no approximations)
- [ ] All Playfair headings use the right weight (700 or 800)
- [ ] Border radius matches spec for this element type
- [ ] Shadows use shadow utility class, not raw `box-shadow`
- [ ] `"use client"` directive present if and only if needed
- [ ] Props interface exported if used across files

## Quick reference

### Dark surface text

```tsx
<h2 className="text-white">Title</h2>
<p className="text-white/55">Body</p>
<span className="text-white/45">Meta</span>
<span className="text-white/35">Stat label</span>
```

### Standard card shell

```tsx
<div className="rounded-[18px] border-[1.5px] border-[var(--color-border-soft)] bg-white p-6 shadow-card">
  {children}
</div>
```

### Ember accent chip/badge

```tsx
<span className="rounded-[100px] bg-[var(--color-ember-light)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--color-ember-dim)]">
  {label}
</span>
```

### Eyebrow label pattern

```tsx
<span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
  Section title
</span>
```

### Stagger section wrapper

```tsx
<StaggerSection index={0}>
  {/* section content */}
</StaggerSection>
```
