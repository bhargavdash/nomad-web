---
name: new-api-route
description: Scaffold a Next.js App Router API route with Supabase auth guard, typed request/response, and consistent error handling
---

When creating a new API route for Nomad Web, follow this pattern exactly.

## File location

`app/api/<resource>/route.ts` (or `app/api/<resource>/[id]/route.ts` for dynamic segments)

## Standard template

```ts
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

interface <Resource>Response {
  // define response shape here
}

export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // fetch data — always scope to user.id to enforce RLS
    const { data, error } = await supabase
      .from("table_name")
      .select("*")
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ data } satisfies { data: <Resource>Response[] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
```

## Rules

1. **Always** call `supabase.auth.getUser()` — never trust client-sent user IDs
2. **Always** scope DB queries to `user.id` — Supabase RLS is a second layer, not a replacement
3. Use `async/await` — never `.then()` chains (breaks type inference on untyped promises)
4. Catch variables are `unknown` — narrow with `instanceof Error` before accessing `.message`
5. Type the response with an interface — use `satisfies` for return type checking
6. For `POST`/`PATCH` body: `const body = await req.json() as <RequestBody>` — define the interface first
7. Never use `next/router` — use `next/navigation` in client components, not in route handlers
8. Export only the HTTP methods you implement (`GET`, `POST`, `PATCH`, `DELETE`) — no default export

## Dynamic route example

For `app/api/trips/[id]/route.ts`:

```ts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ...
}
```

Note: In Next.js 16+, `params` is a Promise — always `await` it.
