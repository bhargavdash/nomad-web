"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { ResearchDiscovery, ResearchJobResponse } from "@/types/api";

const POLL_INTERVAL = 2000;
const MAX_CONSECUTIVE_FAILURES = 3;

const PHASE_TO_SOURCE: Record<number, string> = {
  0: "youtube",
  1: "youtube",
  2: "reddit",
  3: "google",
  4: "blog",
  5: "building",
};

const INITIAL_DISCOVERY: ResearchDiscovery = {
  id: "init",
  title: "Starting your research...",
  body: "Our AI is beginning to scan sources for the best recommendations for your trip.",
  tags: ["#Starting"],
  source: "youtube",
};

type Stats = { places: number; tips: number; photoStops: number };

export function useResearchPoller(tripId: string, onComplete: () => void) {
  const [phase, setPhase] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [progressLabel, setProgressLabel] = React.useState("STARTING RESEARCH…");
  const [stats, setStats] = React.useState<Stats>({ places: 0, tips: 0, photoStops: 0 });
  const [activeSource, setActiveSource] = React.useState("youtube");
  const [discovery, setDiscovery] = React.useState<ResearchDiscovery>(INITIAL_DISCOVERY);
  const [hasError, setHasError] = React.useState(false);
  const [restartKey, setRestartKey] = React.useState(0);

  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const retry = React.useCallback(() => {
    setHasError(false);
    setProgress(0);
    setProgressLabel("STARTING RESEARCH…");
    setDiscovery(INITIAL_DISCOVERY);
    setRestartKey((k) => k + 1);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    let completed = false;
    let failures = 0;
    let prevDiscoveryCount = 0;

    const poll = async () => {
      if (cancelled || completed) return;
      try {
        const res = await api.get<ResearchJobResponse>(`/trips/${tripId}/research`);
        const data = res.data;
        failures = 0;
        if (cancelled || completed) return;

        if (data.status === "failed") {
          setHasError(true);
          return;
        }

        setPhase(data.phase);
        setProgress(data.progress);
        setProgressLabel(data.message ?? "Researching…");
        setStats(data.stats);
        setActiveSource(PHASE_TO_SOURCE[data.phase] ?? "youtube");

        const list = Array.isArray(data.discoveries) ? data.discoveries : [];
        if (list.length > prevDiscoveryCount) {
          prevDiscoveryCount = list.length;
          const latest = list[list.length - 1];
          if (latest) setDiscovery(latest);
        }

        if (data.status === "completed") {
          completed = true;
          setProgress(100);
          setTimeout(() => {
            if (!cancelled) onCompleteRef.current();
          }, 700);
        }
      } catch (err) {
        failures += 1;
        if (failures >= MAX_CONSECUTIVE_FAILURES) {
          setHasError(true);
        }
        console.warn("[research poll] failed:", err);
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [tripId, restartKey]);

  return {
    phase,
    progress,
    progressLabel,
    stats,
    activeSource,
    discovery,
    hasError,
    retry,
  };
}
