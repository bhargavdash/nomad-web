"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

// Must match "Email OTP Length" in the Supabase dashboard
// (Authentication → Sign In / Providers → Email).
const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyEmailForm />
    </React.Suspense>
  );
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [errorShake, setErrorShake] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (code.length !== OTP_LENGTH) {
      setErrorShake((k) => k + 1);
      toast.error(`Enter the ${OTP_LENGTH}-digit code from your email.`);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase().auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });
      if (error) {
        setErrorShake((k) => k + 1);
        toast.error(error.message);
        return;
      }
      // verifyOtp returns a session on success — go straight into the app.
      router.replace("/home");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      const { error } = await supabase().auth.resend({ type: "signup", email });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`We emailed a new code to ${email}.`);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
        Verify your email
      </span>

      <p className="mt-3 text-body-m text-[var(--color-muted)]">
        Enter the {OTP_LENGTH}-digit code we sent to{" "}
        <span className="font-medium text-[var(--color-ink)]">{email}</span>.
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
          inputMode="numeric"
          placeholder={"0".repeat(OTP_LENGTH)}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
          }
          maxLength={OTP_LENGTH}
          autoComplete="one-time-code"
          autoFocus
          className="h-auto py-3.5 text-center font-mono text-[22px] tracking-[0.5em]"
        />
        <Button type="submit" loading={submitting} size="lg" className="mt-2">
          Verify
        </Button>
      </motion.form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="mt-6 self-center text-body-s font-medium text-[var(--color-ember)] hover:underline underline-offset-2 disabled:opacity-50"
      >
        {resending ? "Sending…" : "Resend code"}
      </button>

      <p className="mt-8 text-body-xs text-[var(--color-muted)]">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--color-ember)] hover:underline underline-offset-2"
        >
          Sign up again
        </Link>
      </p>
    </AuthShell>
  );
}
