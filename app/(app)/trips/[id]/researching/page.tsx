"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/brand/SourceBadge";
import { RESEARCH_SOURCES } from "@/data/placeholders";
import { useResearchPoller } from "@/hooks/useResearchPoller";

export default function ResearchingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = params.id;

  const { progress, progressLabel, stats, activeSource, discovery, phase, hasError, retry } =
    useResearchPoller(tripId, () => router.replace(`/trips/${tripId}`));

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1100px] flex-col items-center px-8 py-16">
      {/* Eyebrow */}
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ember)]">
        AI is reading the internet
      </span>

      <h1 className="mt-4 max-w-[700px] text-center font-display text-[48px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
        Building your <span className="text-wander">trip</span>.
      </h1>
      <p className="mt-3 max-w-[560px] text-center text-[15px] text-[var(--color-muted)]">
        Scanning YouTube, Reddit, blogs and maps. This usually takes 30–90 seconds.
      </p>

      {/* Pulsing orb */}
      <div className="relative mt-14 mb-12 h-[200px] w-[200px]">
        <div className="absolute inset-0 animate-orb-ring rounded-full bg-[var(--color-ember)]/30" />
        <div
          className="absolute inset-0 animate-orb-ring rounded-full bg-[var(--color-peach)]/30"
          style={{ animationDelay: "1s" }}
        />
        <div className="animate-orb-pulse relative h-full w-full rounded-full bg-gradient-to-br from-[var(--color-ember)] to-[var(--color-peach)] shadow-[0_20px_60px_rgba(196,98,58,0.35)]" />
      </div>

      {/* Progress label + bar */}
      <div className="w-full max-w-[640px]">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
          <span className="text-[var(--color-muted)]">{progressLabel}</span>
          <span className="text-[var(--color-ember)]">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-cream-2)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-ember)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 rounded-[20px] border-[1.5px] border-[var(--color-border-soft)] bg-white p-6">
          <Stat value={stats.places} label="Places found" />
          <Stat value={stats.tips} label="Local tips" />
          <Stat value={stats.photoStops} label="Photo stops" />
        </div>

        {/* Discovery card */}
        <div className="relative mt-6 min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={discovery.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="rounded-[20px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-cream)] p-6 shadow-card"
            >
              <div className="flex items-center justify-between gap-3">
                <SourceBadge source={discovery.source} />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  Latest find
                </span>
              </div>
              <h3 className="mt-3 font-display text-[22px] font-bold leading-tight text-[var(--color-ink)]">
                {discovery.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[var(--color-muted)]">
                {discovery.body}
              </p>
              {discovery.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {discovery.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-[100px] bg-[var(--color-ember-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-ember-dim)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Source rows */}
        <div className="mt-8 flex flex-col gap-2">
          {RESEARCH_SOURCES.map((src, idx) => {
            const sourceActive = activeSource === src.key;
            const sourceDone = phase > idx + 1 && phase < 5;
            const allDone = phase >= 5;
            return (
              <div
                key={src.key}
                className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-[var(--color-border-soft)] bg-white px-4 py-3 transition-all"
                style={{ opacity: sourceActive || sourceDone || allDone ? 1 : 0.5 }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background: sourceActive || sourceDone || allDone ? src.color : "#DDD8CC",
                    boxShadow: sourceActive ? `0 0 12px ${src.color}` : "none",
                  }}
                />
                <span className="font-sans text-[14px] font-medium text-[var(--color-ink)]">
                  {src.label}
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {sourceDone || allDone ? "scanned" : sourceActive ? "scanning…" : "queued"}
                </span>
              </div>
            );
          })}
        </div>

        {hasError && (
          <div className="mt-6 rounded-[16px] border-[1.5px] border-red-300 bg-red-50 p-5 text-center">
            <p className="text-[14px] text-red-700">
              We hit a snag reading sources. The trip is saved — you can try again.
            </p>
            <Button variant="primary" size="sm" onClick={retry} className="mt-3">
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-[36px] font-extrabold text-[var(--color-ink)]">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </div>
    </div>
  );
}
