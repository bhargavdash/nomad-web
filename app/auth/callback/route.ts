import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (!code) {
    console.error("[auth/callback] No code in callback URL — redirecting to signin");
    return NextResponse.redirect(`${origin}/signin?error=no_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Code exchange failed:", error.message, error);
    return NextResponse.redirect(`${origin}/signin?error=exchange_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
