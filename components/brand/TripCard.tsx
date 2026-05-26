"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripStatus, TripSummary } from "@/types/api";

const STATUS_META: Record<TripStatus, { label: string; className: string }> = {
  ready: {
    label: "Ready",
    className: "bg-[var(--color-sage-light)] text-[var(--color-sage)]",
  },
  active: {
    label: "Active",
    className: "bg-[var(--color-sky-light)] text-[var(--color-sky-blue)]",
  },
  completed: {
    label: "Completed",
    className: "bg-[var(--color-cream-2)] text-[var(--color-muted)]",
  },
  archived: {
    label: "Archived",
    className: "bg-[var(--color-cream-2)] text-[var(--color-muted)]",
  },
  researching: {
    label: "Researching",
    className: "bg-[var(--color-ember-light)] text-[var(--color-ember)]",
  },
};

export function TripCard({ trip }: { trip: TripSummary }) {
  const href =
    trip.status === "researching"
      ? `/trips/${trip.id}/researching`
      : `/trips/${trip.id}`;
  const status = STATUS_META[trip.status] ?? {
    label: trip.status ?? "Unknown",
    className: "bg-[var(--color-cream-2)] text-[var(--color-muted)]",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-5 rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)] p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-cream)] text-[var(--color-ember)]">
        <Compass size={24} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate font-display text-[22px] font-bold leading-tight text-[var(--color-ink)]">
            {trip.destination}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-[100px] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>

        <p className="mt-1 truncate text-[13px] text-[var(--color-muted)]">
          {formatDateRange(trip.dateFrom, trip.dateTo)}
          {trip.durationDays ? ` · ${trip.durationDays} days` : ""}
        </p>

        <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-[var(--color-muted)]">
          <span>{trip.statsPlaces} places</span>
          <span>{trip.statsTips} tips</span>
          <span>{trip.statsPhotoStops} photo stops</span>
        </div>
      </div>

      <span className="shrink-0 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ember)]">
        →
      </span>
    </Link>
  );
}

function formatDateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "Dates not set";
  const fmt = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  const left = fmt(from);
  const right = fmt(to);
  if (left && right) return `${left} → ${right}`;
  return left || right;
}
