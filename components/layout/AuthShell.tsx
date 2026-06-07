import * as React from "react";
import Image from "next/image";
import { NomadLogo } from "@/components/brand/NomadLogo";

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[3fr_2fr]">
      {/* Left pane — full-bleed hero */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/auth-bg-image.avif"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy-3)]/55 via-transparent to-[var(--color-navy-3)]/85" />

        {/* Overlay text bottom-left */}
        <div className="absolute bottom-14 left-12 right-12">
          <h2 className="max-w-[500px] text-display-xl text-white">
            Your journey{" "}
            <span className="text-wander">begins</span>{" "}
            here
          </h2>
          <p className="mt-4 max-w-[440px] text-body-m text-white/55">
            Curating the world&apos;s most breathtaking escapes for the intentional
            traveler. Escape the ordinary and rediscover the art of discovery.
          </p>
        </div>
      </div>

      {/* Right pane — form (cream bg per split-panel design; intentional departure from dark-navy auth spec) */}
      <div className="flex flex-col bg-[var(--color-cream)] px-8 py-10 lg:px-14 lg:py-12">
        <div className="flex flex-1 flex-col items-start justify-center">
          <div className="w-full max-w-[420px]">
            <NomadLogo />
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <footer className="text-label-xs text-[var(--color-muted)]">
          © Nomad — travel, with feeling.
        </footer>
      </div>
    </div>
  );
}
