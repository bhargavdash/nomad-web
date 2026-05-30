"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

interface TrendingPickNoteProps {
  destination: string;
  country?: string | null;
  duration: string;
  blurb: string;
  vibes: string[];
  onDismiss: () => void;
}

/**
 * Surfaced only when the user lands on /plan via a trending card click
 * (i.e. `?from=trending` is present). Echoes back the snippet of context
 * the user just saw on the home page so they know this trip is the same
 * pick — without copying that context into the form's actual vibe state
 * (the trending `vibe_tags` vocabulary is broader than the form's vibes).
 */
export function TrendingPickNote({
  destination,
  country,
  duration,
  blurb,
  vibes,
  onDismiss,
}: TrendingPickNoteProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      role="note"
      aria-label="Trending pick context"
      className="relative overflow-hidden rounded-[24px] border-[1.5px] border-[var(--color-ember)]/30 bg-gradient-to-br from-[var(--color-cream)] via-white to-[var(--color-cream-2)] p-7 shadow-card"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss trending pick"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-[100px] bg-[var(--color-ember)]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
          <Sparkles size={11} strokeWidth={2.25} />
          From the trending picks
        </span>
      </div>

      <h2 className="mt-4 font-display text-[28px] font-extrabold leading-[1.1] text-[var(--color-ink)]">
        {destination}
        {country && country !== destination && (
          <span className="font-display text-[18px] font-medium text-[var(--color-muted)]">
            {" "}
            · {country}
          </span>
        )}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
        <span>{duration}</span>
        <span aria-hidden="true">·</span>
        <span>pre-filled below</span>
      </div>

      <blockquote className="mt-4 border-l-2 border-[var(--color-ember)]/40 pl-4 text-[15px] leading-[1.55] text-[var(--color-ink)]/85">
        “{blurb}”
      </blockquote>

      {vibes.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {vibes.map((v) => (
            <span
              key={v}
              className="rounded-[100px] border border-[var(--color-border-soft)] bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)]"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </motion.aside>
  );
}
