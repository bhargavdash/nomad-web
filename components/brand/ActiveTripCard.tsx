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
  stats: { places: number; tips: number; photoStops: number };
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
  stats,
  href = "#",
  imageUrl,
  priority,
  className,
}: ActiveTripCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-[24px] bg-[var(--color-navy)] p-8 shadow-active-trip transition-transform duration-200 hover:-translate-y-1",
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
      {/* Readability overlay — keeps the cream/white text legible over any photo. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-navy)]/95 via-[var(--color-navy)]/80 to-[var(--color-navy)]/50" />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[var(--color-ember)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--color-peach)]/15 blur-3xl" />

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

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <Stat value={stats.places} label="Places" />
          <Stat value={stats.tips} label="Tips" />
          <Stat value={stats.photoStops} label="Photo stops" />
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-cream)] group-hover:text-[var(--color-ember)] transition-colors">
          Open itinerary
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-[32px] font-extrabold text-[var(--color-cream)]">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
        {label}
      </div>
    </div>
  );
}
