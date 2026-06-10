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

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorShake, setErrorShake] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // No emailRedirectTo — confirmation is done in-app via 6-digit OTP code
      // ({{ .Token }} in the Supabase email template), not a magic link.
      const { data, error } = await supabase().auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (error) {
        setErrorShake((k) => k + 1);
        toast.error(error.message);
        return;
      }
      // Supabase obfuscates duplicate signups: an already-registered email
      // returns a fake user with an empty identities array and sends NO email.
      if (data.user && data.user.identities?.length === 0) {
        setErrorShake((k) => k + 1);
        toast.error("An account with this email already exists. Sign in instead.");
        return;
      }
      if (data.session) {
        router.replace("/home");
      } else {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { error } = await supabase().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  return (
    <AuthShell>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
        Start your adventure here
      </span>

      <p className="mt-3 text-body-m text-[var(--color-muted)]">
        We&apos;ll read the internet for you. Tell us the vibe, get the itinerary.
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
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
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
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Button type="submit" loading={submitting} size="lg" className="mt-2">
          Create account
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
        Continue with Google
      </Button>

      <p className="mt-8 text-body-xs text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-[var(--color-ember)] hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
