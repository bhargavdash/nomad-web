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
      const { data, error } = await supabase().auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorShake((k) => k + 1);
        toast.error(error.message);
        return;
      }
      if (data.session) {
        router.replace("/home");
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <AuthShell heroQuery="bali rice terraces morning">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ember)]">
        Start the wander
      </span>

      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
        Make travel <span className="text-wander">personal</span> again.
      </h1>
      <p className="mt-3 text-[15px] text-[var(--color-muted)]">
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

      <p className="mt-8 text-[13px] text-[var(--color-muted)]">
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
