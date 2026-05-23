"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function supabase() {
  if (!cached) cached = createSupabaseBrowserClient();
  return cached;
}
