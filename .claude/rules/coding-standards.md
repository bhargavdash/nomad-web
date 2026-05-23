# Nomad Web — Coding Standards

> Always-loaded rules that apply to every conversation.

## Next.js (App Router)

1. Read `node_modules/next/dist/docs/` for the specific Next.js version before writing any router/server code — APIs differ from training data.
2. Add `"use client"` only when you need browser APIs, event handlers, or React hooks. Server Components are the default.
3. Never use `next/router` — use `next/navigation` (`useRouter`, `useParams`, `useSearchParams`).
4. Dynamic params: `useParams<{ id: string }>()` with explicit generic — never access `params` without typing.
5. Layouts are server components by default. Route groups like `(app)/` and `(auth)/` have their own `layout.tsx`.

## TypeScript (strict mode)

6. **Never use implicit `any`** — `strict: true` is on, including `noImplicitAny` and `useUnknownInCatchVariables`.
7. Use `async/await` instead of `.then(({ param }) => …)` — callback destructuring loses type inference when the Promise resolves to `any`.
8. Catch variables are `unknown` — always narrow: `if (err instanceof Error) { ... }` before accessing `.message`.
9. Type `useState` when the initial value can't infer the full type: `useState<TripSummary | null>(null)`.
10. Never `as any`. Use `as SpecificType` only at system boundaries (API responses, Supabase metadata).

## Tailwind CSS v4

11. Design tokens live in `app/globals.css` under `@theme { }` — **no** `tailwind.config.ts` file.
12. Reference tokens as CSS custom properties: `text-[var(--color-ember)]`, `bg-[var(--color-cream)]`.
13. Use the type-scale utility classes: `.text-display-xl`, `.text-body-m`, `.text-mono-xs`, etc. — never raw font-size numbers for headings.
14. Use the shadow utilities: `.shadow-card`, `.shadow-postcard`, `.shadow-ember-hover` — never arbitrary `box-shadow` values.
15. **Never approximate colours** — copy exact hex values from `design-tokens.md`.

## Components

16. All components are `.tsx`. Define a clear props interface above the component.
17. Use `cn()` from `lib/utils.ts` for conditional class merging — never string concatenation.
18. Server components render data-fetching logic. Client components handle interactivity only.
19. Prefer `React.useState`, `React.useEffect` etc. via namespace import (`import * as React from "react"`) matching the existing codebase style.

## API / Data fetching

20. Use `api.get<ReturnType>("/endpoint")` from `lib/api.ts` — always provide the generic for typed responses.
21. All async operations that can fail need a try/catch. Use `toast.error()` from Sonner for user-visible errors.
22. Never fetch in `useEffect` without a cancellation guard (`let cancelled = false` + cleanup).

## Design Reference Priority

HTML spec / Figma > `.claude/rules/design-tokens.md` > CLAUDE.md

## Rule File Map

| File | Scope | What it contains |
|---|---|---|
| `rules/design-tokens.md` | `app/**`, `components/**` | CSS custom properties, typography utilities, shadows |
| `rules/component-specs.md` | `components/**` | Component inventory and visual specs |
| `skills/build-component.md` | (invoked manually) | Step-by-step component building workflow |
| `skills/build-page.md` | (invoked manually) | Step-by-step page building workflow |
