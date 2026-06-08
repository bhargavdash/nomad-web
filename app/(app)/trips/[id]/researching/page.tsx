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

  const { progress, progressLabel, stats, activeSource, discovery, phase, hasError, isRateLimited, retryAfterMs, retry } =
    useResearchPoller(tripId, () => router.replace(`/trips/${tripId}`));

  // When research has stopped (hard failure or rate limit) we hide the
  // animated ticker entirely — a pulsing orb stuck at 0% next to an error
  // reads as broken. Show a single, clear status instead.
  const isStopped = hasError || isRateLimited;

  const eyebrow = hasError
    ? "Research stopped"
    : isRateLimited
      ? "Server busy"
      : "AI is reading the internet";

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1100px] flex-col items-center px-8 py-16">
      {/* Eyebrow */}
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ember)]">
        {eyebrow}
      </span>

      <h1 className="mt-4 max-w-[700px] text-center font-display text-[48px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
        {hasError ? (
          <>We couldn&apos;t finish this <span className="text-wander">trip</span>.</>
        ) : isRateLimited ? (
          <>Just a <span className="text-wander">moment</span>.</>
        ) : (
          <>Building your <span className="text-wander">trip</span>.</>
        )}
      </h1>
      <p className="mt-3 max-w-[560px] text-center text-[15px] text-[var(--color-muted)]">
        {hasError
          ? "The research run didn't complete. Your trip details are saved — retry below, or head back and start again."
          : isRateLimited
            ? "You've started a lot of trips in a short window. Your trip is saved — wait a moment and retry."
            : "Scanning YouTube, Reddit, blogs and maps. This usually takes 30–90 seconds."}
      </p>

      {/* Pulsing orb — only while research is actually running */}
      {!isStopped && (
        <div className="relative mt-14 mb-12 h-[200px] w-[200px]">
          <div className="absolute inset-0 animate-orb-ring rounded-full bg-[var(--color-ember)]/30" />
          <div
            className="absolute inset-0 animate-orb-ring rounded-full bg-[var(--color-peach)]/30"
            style={{ animationDelay: "1s" }}
          />
          <div className="animate-orb-pulse relative h-full w-full rounded-full bg-gradient-to-br from-[var(--color-ember)] to-[var(--color-peach)] shadow-[0_20px_60px_rgba(196,98,58,0.35)]" />
        </div>
      )}

      {/* Progress label + bar */}
      <div className="w-full max-w-[640px]">
        {!isStopped && (
          <>
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
              {(() => {
                const cleanedTags = [...new Set(discovery.tags.map((t) => t.replace(/^[^\p{L}\p{N}\s]+\s*/u, "").trim()).filter(Boolean))];
                return cleanedTags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cleanedTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-[100px] bg-[var(--color-ember-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-ember-dim)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null;
              })()}
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
          </>
        )}

        {isRateLimited && (
          <div className="mt-10 rounded-[20px] border-[1.5px] border-amber-300 bg-amber-50 p-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600">
              ⏱ Server busy
            </p>
            <p className="mt-3 text-[15px] text-amber-800">
              {`Too many requests. Your trip is saved — wait about ${retryAfterMs ? Math.ceil(retryAfterMs / 60_000) : 1} minute${retryAfterMs && retryAfterMs <= 60_000 ? '' : 's'}, then retry.`}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button variant="primary" size="md" onClick={retry}>
                Retry research
              </Button>
              <Button variant="outline" size="md" onClick={() => router.push("/plan")}>
                Back to planning
              </Button>
            </div>
          </div>
        )}

        {hasError && !isRateLimited && (
          <div className="mt-10 rounded-[20px] border-[1.5px] border-red-300 bg-red-50 p-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-red-600">
              ⚠ Research failed
            </p>
            <p className="mt-3 text-[15px] text-red-700">
              We couldn&apos;t finish reading sources for this trip. This is usually temporary —
              your trip details are saved, so you can start a fresh plan or come back to it later.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button variant="primary" size="md" onClick={() => router.push("/plan")}>
                Start a new plan
              </Button>
              <Button variant="outline" size="md" onClick={() => router.push("/trips")}>
                Back to my trips
              </Button>
            </div>
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
