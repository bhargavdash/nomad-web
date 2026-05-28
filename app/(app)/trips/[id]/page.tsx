"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

import { PostcardCard } from "@/components/itinerary/PostcardCard";
import { RemoteImage } from "@/components/brand/RemoteImage";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { TripFullResponse, TripStop } from "@/types/api";

export default function ItineraryPage() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const [data, setData] = React.useState<TripFullResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeDayId, setActiveDayId] = React.useState<string | null>(null);
  const [removingStops, setRemovingStops] = React.useState<Set<string>>(new Set());

  const load = React.useCallback(async () => {
    try {
      const res = await api.get<TripFullResponse>(`/trips/${tripId}/full`);
      setData(res.data);
      if (!activeDayId && res.data.days.length > 0) {
        setActiveDayId(res.data.days[0].id);
      }
    } catch (err) {
      console.error("[itinerary] load failed:", err);
      toast.error("Couldn't load this trip");
    } finally {
      setLoading(false);
    }
  }, [tripId, activeDayId]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  React.useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-day-id");
          if (id) setActiveDayId(id);
        }
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 },
    );
    data.days.forEach((day) => {
      const el = document.getElementById(`day-${day.id}`);
      if (el) {
        el.setAttribute("data-day-id", day.id);
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [data]);

  const handleLockToggle = async (stop: TripStop) => {
    try {
      const res = await api.patch<{ stop: TripStop }>(`/trips/${tripId}/stops/${stop.id}`, {
        locked: !stop.locked,
      });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          days: prev.days.map((d) => ({
            ...d,
            stops: d.stops?.map((s) => (s.id === stop.id ? res.data.stop : s)),
          })),
        };
      });
    } catch {
      toast.error("Couldn't update that stop");
    }
  };

  const handleRemove = async (stop: TripStop) => {
    setRemovingStops((prev) => new Set(prev).add(stop.id));
    try {
      await api.delete(`/trips/${tripId}/stops/${stop.id}`);
      setTimeout(() => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            days: prev.days.map((d) => ({
              ...d,
              stops: d.stops?.filter((s) => s.id !== stop.id),
            })),
          };
        });
      }, 300);
    } catch {
      setRemovingStops((prev) => {
        const next = new Set(prev);
        next.delete(stop.id);
        return next;
      });
      toast.error("Couldn't remove that stop");
    }
  };

  // Show a city banner once per unique city (skip the destination itself — the
  // hero already covers it). Repeated cities render a plain header, so we never
  // show duplicate imagery.
  const cityBannerDays = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    if (!data) return map;
    const dest = data.trip.destination.trim().toLowerCase();
    const seen = new Set<string>();
    data.days.forEach((day) => {
      const key = (day.city ?? "").trim().toLowerCase();
      if (key && key !== dest && !seen.has(key)) {
        seen.add(key);
        map[day.id] = true;
      }
    });
    return map;
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[var(--color-navy-3)]">
        <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/55">
          Loading trip…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[var(--color-navy-3)] text-white/65">
        Trip not found.
      </div>
    );
  }

  const activeDay =
    data.days.find((d) => d.id === activeDayId) ?? data.days[0] ?? null;

  return (
    <div className="-mt-[1px] min-h-screen bg-[var(--color-navy-3)] text-white">
      {/* Hero banner */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <RemoteImage
          src={data.trip.heroImageUrl}
          fallbackQuery={data.trip.destination}
          alt={data.trip.destination}
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-3)] via-[var(--color-navy-3)]/40 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-between px-8 pt-8 pb-12">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-[100px] bg-white/10 px-4 py-2 text-[13px] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowLeft size={15} /> Back
            </Link>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
              className="inline-flex items-center gap-2 rounded-[100px] bg-white/10 px-4 py-2 text-[13px] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Share2 size={15} /> Share
            </button>
          </div>

          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
              AI-generated itinerary
            </span>
            <h1 className="mt-3 max-w-[820px] font-display text-[64px] font-extrabold leading-[1.02]">
              {data.trip.destination}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-white/65">
              {data.trip.durationDays && <span>{data.trip.durationDays} days</span>}
              <span>· {data.trip.statsPlaces} places</span>
              <span>· {data.trip.statsTips} local tips</span>
              <span>· {data.trip.statsPhotoStops} photo stops</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trip overview (Tier 2) — only when the agent produced it */}
      {(data.trip.routeSummary ||
        data.trip.transportStrategy ||
        data.trip.budgetEstimate ||
        (data.trip.seasonalTips && data.trip.seasonalTips.length > 0) ||
        (data.trip.stayByCity && Object.keys(data.trip.stayByCity).length > 0)) && (
        <section className="mx-auto max-w-[1200px] px-8 py-10">
          <div className="grid gap-5 md:grid-cols-2">
            {data.trip.routeSummary && (
              <OverviewCard label="Route" value={data.trip.routeSummary} />
            )}
            {data.trip.transportStrategy && (
              <OverviewCard label="Getting around" value={data.trip.transportStrategy} />
            )}
            {data.trip.budgetEstimate && (
              <OverviewCard label="Rough budget" value={data.trip.budgetEstimate} />
            )}
            {data.trip.seasonalTips && data.trip.seasonalTips.length > 0 && (
              <OverviewCard label="Good to know" value={data.trip.seasonalTips.join(" · ")} />
            )}
          </div>
          {data.trip.stayByCity && Object.keys(data.trip.stayByCity).length > 0 && (
            <div className="mt-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
                Where to stay
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(data.trip.stayByCity).map(([city, stay]) => (
                  <div key={city} className="text-[14px] leading-[1.5] text-white/70">
                    <span className="font-medium text-white">{city}:</span> {stay}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Day tabs */}
      <div className="sticky top-[72px] z-20 border-y border-white/8 bg-[var(--color-navy-3)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-8 py-3 scrollbar-none">
          {data.days.map((d) => {
            const active = d.id === activeDay?.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDayId(d.id);
                  document.getElementById(`day-${d.id}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={cn(
                  "relative shrink-0 rounded-[100px] px-4 py-2 font-sans text-[13px] font-medium transition-colors",
                  active ? "text-[var(--color-ember)]" : "text-white/55 hover:text-white",
                )}
              >
                Day {d.dayNumber} · {d.city}
                {active && (
                  <motion.span
                    layoutId="day-underline"
                    className="absolute -bottom-3.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[var(--color-ember)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Days */}
      <main className="mx-auto max-w-[680px] px-6 py-16">
        {data.days.map((day) => (
          <section key={day.id} id={`day-${day.id}`} className="mb-20 scroll-mt-[140px]">
            <div className="mb-8">
              {cityBannerDays[day.id] ? (
                <div className="relative mb-5 h-[200px] w-full overflow-hidden rounded-[20px] shadow-postcard">
                  <RemoteImage
                    src={day.imageUrl}
                    fallbackQuery={day.city}
                    alt={day.city}
                    className="object-cover"
                    sizes="(min-width: 680px) 680px, 90vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-peach)]">
                      Day {day.dayNumber} — {day.city}
                    </span>
                    <h2 className="mt-1.5 font-display text-[32px] font-extrabold leading-[1.05] text-white">
                      {day.title}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
                    Day {day.dayNumber} — {day.city}
                  </span>
                  <h2 className="mt-2 font-display text-[32px] font-extrabold leading-[1.05] text-white">
                    {day.title}
                  </h2>
                </div>
              )}
              {day.description && (
                <p className="text-[15px] leading-[1.55] text-white/55">{day.description}</p>
              )}
            </div>

            {day.stops && day.stops.length > 0 ? (
              <div className="flex flex-col gap-8">
                {day.stops.map((stop) => (
                  <div key={stop.id} className="flex gap-4">
                    <div className="w-[68px] shrink-0 pt-2 text-right">
                      <div className="font-display text-[24px] font-bold leading-none text-white">
                        {stop.time}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                        {stop.ampm}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <PostcardCard
                        stop={stop}
                        onLockToggle={() => handleLockToggle(stop)}
                        onRemove={() => handleRemove(stop)}
                        exiting={removingStops.has(stop.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-white/8 bg-white/5 p-6 text-center text-white/55">
                {day.stopCount} stops planned · details syncing
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/5 p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
        {label}
      </div>
      <p className="mt-2 text-[14px] leading-[1.55] text-white/75">{value}</p>
    </div>
  );
}
