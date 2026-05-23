# Build Page — Nomad Web

Use this skill when asked to build an entire Next.js page or route.

## Workflow

### Step 1 — Identify the route

Determine where the page lives in the App Router:

| Route group | Layout | Guard | Background |
|---|---|---|---|
| `(app)/` | TopNav + auth redirect | Requires session | `bg-[var(--color-cream)]` |
| `(auth)/` | Centered auth shell | Redirects if authed | Dark navy |
| Root `/` | Minimal root layout | None | `bg-[var(--color-cream)]` |
| `trips/[id]` page | Inside `(app)/` | Session required | `bg-[var(--color-navy-3)]` |

### Step 2 — Read the spec

1. Read `.claude/rules/design-tokens.md` for tokens
2. Read `.claude/rules/component-specs.md` for which components to use
3. Reference the Figma file or `c:/Users/DELL/code/nomad/docs/nomad_design_spec.html` for layout

### Step 3 — Check existing components

Before building new components, check what already exists in `components/`. Build missing ones first using the build-component workflow.

### Step 4 — Decide server vs client

- If the page only renders data from an API call on load → consider making it a Server Component (no `"use client"`)
- If the page uses `useState`, event handlers, or client-side navigation → add `"use client"`
- Split: keep data-fetching logic server-side where possible, extract interactive parts into client components

### Step 5 — Build the page

Template for a client-side authenticated page:

```tsx
"use client";

import * as React from "react";
import { StaggerSection } from "@/components/layout/StaggerSection";

export default function PageName() {
  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-24 pt-12">
      <StaggerSection index={0}>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
          Eyebrow
        </span>
        <h1 className="mt-3 font-display text-[56px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
          Page <span className="text-wander">title</span>
        </h1>
      </StaggerSection>
      
      {/* Sections wrapped in StaggerSection with incrementing index */}
    </div>
  );
}
```

Template for the dark itinerary-style page:

```tsx
"use client";

export default function DarkPage() {
  return (
    <div className="-mt-[1px] min-h-screen bg-[var(--color-navy-3)] text-white">
      {/* content */}
    </div>
  );
}
```

### Step 6 — Data fetching pattern

Always use a cancellation guard in `useEffect`:

```tsx
React.useEffect(() => {
  let cancelled = false;
  
  const load = async () => {
    try {
      const res = await api.get<ReturnType>("/endpoint");
      if (cancelled) return;
      setData(res.data);
    } catch (err) {
      if (!cancelled) toast.error("Couldn't load data");
    }
  };
  
  load();
  return () => { cancelled = true; };
}, [dependency]);
```

### Step 7 — Validate

- [ ] Page background matches the route group spec
- [ ] All sections wrapped in `<StaggerSection index={n}>`
- [ ] Data fetching has cancellation guard
- [ ] TypeScript: all state typed, no implicit `any`
- [ ] Async/await used (not `.then()` destructuring) for type safety
- [ ] `toast.error()` on all catch blocks visible to the user
- [ ] `"use client"` present if and only if needed

## Layout constants

```
max-w-[1440px] px-8   ← standard page container
max-w-[680px] px-6    ← narrow reading column (itinerary)
pt-12 pb-24           ← standard page top/bottom padding
top-[72px]            ← sticky offset (TopNav height)
scroll-mt-[140px]     ← scroll target offset (TopNav + day tabs)
```
