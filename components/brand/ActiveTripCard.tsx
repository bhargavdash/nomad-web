"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RemoteImage } from "./RemoteImage";

interface ActiveTripCardProps {
  destination: string;
  dateFrom: string;
  dateTo: string;
  duration: number;
  href?: string;
  /** Self-hosted hero photo — the same image shown on the trip detail hero. */
  imageUrl?: string | null;
  /** Set when this is the above-the-fold hero so Next preloads it as the LCP. */
  priority?: boolean;
  className?: string;
}

export function ActiveTripCard({
  destination,
  dateFrom,
  dateTo,
  duration,
  href = "#",
  imageUrl,
  priority,
  className,
}: ActiveTripCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[24px] bg-[var(--color-navy)] p-8 shadow-active-trip transition-transform duration-200 hover:-translate-y-1",
        className,
      )}
    >
      {/* Hero photo — same self-hosted image as the trip detail hero. Falls
          back to RemoteImage's navy gradient placeholder when none resolved. */}
      <RemoteImage
        src={imageUrl}
        fallbackQuery={destination}
        alt={destination}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 1376px"
        priority={priority}
      />
      {/* Subtle scrim — transparent top, light navy at bottom for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-navy)]/35 to-[var(--color-navy)]/65" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5DD4A8]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5DD4A8]">
            Active trip
          </span>
        </div>

        <h2 className="mt-4 font-display text-[36px] font-extrabold leading-[1.05] text-[var(--color-cream)]">
          {destination}
        </h2>

        <p className="mt-2 text-[14px] text-white/55">
          {dateFrom} → {dateTo} · {duration} days
        </p>

        <div className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-cream)] group-hover:text-[var(--color-ember)] transition-colors">
          Open itinerary
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

