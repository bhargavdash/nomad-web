"use client";

import * as React from "react";
import Image from "next/image";
import { NomadLogo } from "@/components/brand/NomadLogo";
import { unsplashByQuery } from "@/lib/unsplash";

interface AuthShellProps {
  children: React.ReactNode;
  heroQuery?: string;
}

export function AuthShell({ children, heroQuery = "rajasthan palace sunset" }: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(420px,560px)_1fr]">
      {/* Left pane — form */}
      <div className="flex flex-col bg-[var(--color-cream)] px-8 py-10 lg:px-14 lg:py-12">
        <NomadLogo />
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
        <footer className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
          © Nomad — travel, with feeling.
        </footer>
      </div>

      {/* Right pane — full-bleed hero */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={unsplashByQuery(heroQuery, 1600, 1800)}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-navy-3)]/70 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ember)]">
            Today&apos;s wander
          </span>
          <h2 className="mt-3 max-w-[460px] font-display text-[44px] font-extrabold leading-[1.05] text-white">
            Empty fort, <span className="text-wander">golden light</span>. Go before the world
            wakes up.
          </h2>
          <p className="mt-3 max-w-[420px] text-[14px] text-white/65">
            Amber Fort, Jaipur — pulled from a YouTube vlog you&apos;d never have found.
          </p>
        </div>
      </div>
    </div>
  );
}
