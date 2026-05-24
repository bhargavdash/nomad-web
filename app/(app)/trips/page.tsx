"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { StaggerSection } from "@/components/layout/StaggerSection";
import { TripCard } from "@/components/brand/TripCard";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { TripSummary } from "@/types/api";

type TripFilter = "all" | "upcoming" | "past";

const FILTERS: { key: TripFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export default function MyTripsPage() {
  const [trips, setTrips] = React.useState<TripSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [filter, setFilter] = React.useState<TripFilter>("all");

  const fetchTrips = React.useCallback(async () => {
    const res = await api.get<{ trips: TripSummary[] }>("/trips");
    return res.data.trips;
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTrips();
        if (cancelled) return;
        setTrips(data);
      } catch {
        if (cancelled) return;
        setError(true);
        toast.error("Couldn't load your trips");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchTrips]);

  const retry = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch {
      setError(true);
      toast.error("Couldn't load your trips");
    } finally {
      setLoading(false);
    }
  }, [fetchTrips]);

  const counts = React.useMemo(
    () => ({
      all: trips.length,
      upcoming: trips.filter((t) => tripBucket(t) === "upcoming").length,
      past: trips.filter((t) => tripBucket(t) === "past").length,
    }),
    [trips],
  );

  const visibleTrips = React.useMemo(() => {
    if (filter === "all") return trips;
    return trips.filter((t) => tripBucket(t) === filter);
  }, [trips, filter]);

  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-24 pt-12">
      <StaggerSection index={0}>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
          Your travels
        </span>
        <h1 className="mt-3 font-display text-[56px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
          My <span className="text-wander">Trips</span>
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] text-[var(--color-muted)]">
          Every adventure you&apos;ve planned, newest first. Pick one to revisit its itinerary.
        </p>
      </StaggerSection>

      <StaggerSection index={1} className="mt-10">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-[100px] px-4 py-2 text-[13px] font-medium transition-colors duration-150",
                filter === f.key
                  ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                  : "border border-[var(--color-border-soft)] text-[var(--color-muted)] hover:text-[var(--color-ink)]",
              )}
            >
              {f.label}
              <span className="ml-1.5 font-mono text-[11px] opacity-60">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </StaggerSection>

      <StaggerSection index={2} className="mt-8">
        {loading ? (
          <LoadingList />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : visibleTrips.length === 0 ? (
          <FilterEmptyState filter={filter} />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visibleTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </StaggerSection>
    </div>
  );
}

function tripBucket(trip: TripSummary): "upcoming" | "past" | "undated" {
  const iso = trip.dateTo ?? trip.dateFrom;
  if (!iso) return "undated";
  const end = new Date(iso);
  if (Number.isNaN(end.getTime())) return "undated";
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return end < todayStart ? "past" : "upcoming";
}

function LoadingList() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[108px] animate-pulse rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)]"
        />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)] py-16 text-center">
      <p className="font-display text-[22px] font-bold text-[var(--color-ink)]">
        We couldn&apos;t load your trips
      </p>
      <p className="mt-2 text-[14px] text-[var(--color-muted)]">Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="mt-6 rounded-[100px] bg-[var(--color-ink)] px-6 py-2.5 text-[14px] font-medium text-[var(--color-cream)] transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)] py-16 text-center">
      <div className="text-[40px]">🧭</div>
      <p className="mt-3 font-display text-[24px] font-bold text-[var(--color-ink)]">No trips yet</p>
      <p className="mt-2 max-w-[360px] text-[14px] text-[var(--color-muted)]">
        Plan your first adventure and it&apos;ll show up here.
      </p>
      <Link
        href="/plan"
        className="mt-6 rounded-[100px] bg-[var(--color-ember)] px-6 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Plan a trip
      </Link>
    </div>
  );
}

function FilterEmptyState({ filter }: { filter: TripFilter }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)] py-16 text-center">
      <p className="font-display text-[22px] font-bold text-[var(--color-ink)]">
        No {filter} trips
      </p>
      <p className="mt-2 text-[14px] text-[var(--color-muted)]">
        Nothing here yet — try a different filter.
      </p>
    </div>
  );
}
