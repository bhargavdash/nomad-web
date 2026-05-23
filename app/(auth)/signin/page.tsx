"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorShake, setErrorShake] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase().auth.signInWithPassword({ email, password });
      if (error) {
        setErrorShake((k) => k + 1);
        toast.error(error.message);
        return;
      }
      router.replace("/home");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log("[signin] Initiating Google OAuth", { redirectTo });
    const { data, error } = await supabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      console.error("[signin] Google OAuth initiation failed:", error.message, error);
      toast.error(error.message);
      return;
    }
    console.log("[signin] Redirecting to Google OAuth URL", { url: data?.url });
  };

  return (
    <AuthShell>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ember)]">
        Welcome back
      </span>

      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
        Where will the <span className="text-wander">wander</span> take you?
      </h1>
      <p className="mt-3 text-[15px] text-[var(--color-muted)]">
        Sign in to pick up your trip, or start a new itinerary.
      </p>

      <motion.form
        key={errorShake}
        animate={errorShake ? "shake" : undefined}
        variants={{
          shake: { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } },
        }}
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-3"
      >
        <Input
          type="email"
          placeholder="you@somewhere.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" loading={submitting} size="lg" className="mt-2">
          Sign in
        </Button>
      </motion.form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--color-border-soft)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          or
        </span>
        <div className="h-px flex-1 bg-[var(--color-border-soft)]" />
      </div>

      <Button variant="dark" size="lg" onClick={handleGoogle} className="w-full">
        <GoogleIcon />
        Continue with Google
      </Button>

      <p className="mt-8 text-[13px] text-[var(--color-muted)]">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--color-ember)] hover:underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
