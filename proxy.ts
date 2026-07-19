import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next internals, static assets, and the `/api/*` proxy path. The API
    // rewrite (next.config.ts) forwards these to the backend, so running the
    // Supabase session middleware here would add a needless getUser() round-trip
    // per request — and the Android client authenticates with a Bearer token,
    // not a Supabase cookie.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
