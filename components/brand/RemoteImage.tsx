"use client";

import * as React from "react";
import Image from "next/image";

import { unsplashByQuery } from "@/lib/unsplash";
import { cn } from "@/lib/utils";

interface RemoteImageProps {
  /** Resolved image URL. While undefined/null, a calm gradient placeholder shows. */
  src?: string | null;
  alt: string;
  /** Used for the deterministic fallback if the resolved URL fails to load. */
  fallbackQuery: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders an already-resolved image URL inside a relative parent (`fill`).
 * Shows a gradient placeholder until the image loads, and falls back to the
 * deterministic Unsplash library if the URL ever errors. Does NOT fetch —
 * callers pass a URL that's already known (resolved at build time), which is
 * what removes the per-image round trip and skeleton delay.
 *
 * Images are now self-hosted (Supabase Storage) and pre-sized, so they run
 * through the Next/Vercel image optimizer: AVIF/WebP + per-`sizes` resizing +
 * edge caching. (The old `unoptimized` escape hatch existed only to dodge
 * 20 MB Wikimedia originals timing out the optimizer; the agent now stores
 * bounded 1280px thumbnails, so that failure class is gone.)
 */
export function RemoteImage({ src, alt, fallbackQuery, className, sizes = "100vw", priority }: RemoteImageProps) {
  const [errored, setErrored] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const display = errored ? unsplashByQuery(fallbackQuery) : src;

  return (
    <>
      {display && (
        <Image
          key={display}
          src={display}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setErrored(true);
          }}
        />
      )}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-navy-2)] to-[var(--color-navy-3)] transition-opacity duration-700",
          display && loaded ? "opacity-0" : "opacity-100",
        )}
      />
    </>
  );
}
