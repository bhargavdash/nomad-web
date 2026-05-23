"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ActiveTripCard } from "@/components/brand/ActiveTripCard";
import { DestinationCard } from "@/components/brand/DestinationCard";
import { HeroCTACard } from "@/components/brand/HeroCTACard";
import { InsightCard } from "@/components/brand/InsightCard";
import { StaggerSection } from "@/components/layout/StaggerSection";
import {
  DEMO_TRIP,
  DEMO_STOPS_DAY1,
  TRENDING_DESTINATIONS,
} from "@/data/placeholders";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { TripSummary } from "@/types/api";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const [activeTrip, setActiveTrip] = React.useState<TripSummary | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const firstName =
    profile?.displayName?.split(" ")[0] ??
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "traveller";

  React.useEffect(() => {
    let cancelled = false;
    api
      .get<{ trips: TripSummary[] }>("/trips")
      .then((res) => {
        if (cancelled) return;
        const active = res.data.trips.find((t) => t.status === "active" || t.status === "ready");
        setActiveTrip(active ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-24">
      {/* Greeting */}
      <StaggerSection index={0} className="pt-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {getTimeOfDay()}
        </span>
        <h1 className="mt-3 max-w-[820px] font-display text-[64px] font-extrabold leading-[1.02] text-[var(--color-ink)]">
          Good {getTimeOfDay()}, <span className="text-wander">{firstName}</span>.
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] text-[var(--color-muted)]">
          What kind of trip are you in the mood for? Tell us a vibe — we&apos;ll dig through the
          real internet so you don&apos;t have to.
        </p>
      </StaggerSection>

      {/* Hero row — asymmetric grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <StaggerSection index={1}>
          {activeTrip ? (
            <ActiveTripCard
              destination={activeTrip.destination}
              dateFrom={activeTrip.dateFrom ?? DEMO_TRIP.dates.from}
              dateTo={activeTrip.dateTo ?? DEMO_TRIP.dates.to}
              duration={activeTrip.durationDays ?? DEMO_TRIP.duration}
              stats={{
                places: activeTrip.statsPlaces,
                tips: activeTrip.statsTips,
                photoStops: activeTrip.statsPhotoStops,
              }}
              href={`/trips/${activeTrip.id}`}
            />
          ) : (
            <HeroCTACard />
          )}
        </StaggerSection>

        <StaggerSection index={2} className="flex flex-col gap-4">
          <SectionEyebrow>Travel insights</SectionEyebrow>
          {DEMO_STOPS_DAY1.slice(0, 3).map((stop) => (
            <InsightCard
              key={stop.id}
              icon={stop.tags[0]?.slice(0, 2) ?? "📌"}
              title={stop.name}
              body={stop.desc}
              source={stop.source}
              destTag="Jaipur"
            />
          ))}
        </StaggerSection>
      </div>

      {/* Trending row */}
      <StaggerSection index={3} className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionEyebrow>Where everyone&apos;s going</SectionEyebrow>
            <h2 className="mt-2 font-display text-[36px] font-extrabold leading-tight text-[var(--color-ink)]">
              Trending <span className="text-wander">right now</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-340)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--color-border-soft)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(340)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--color-border-soft)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <motion.div
          ref={scrollRef}
          className="scrollbar-none -mx-8 flex gap-5 overflow-x-auto px-8 pb-2"
        >
          {TRENDING_DESTINATIONS.map((dest) => (
            <DestinationCard
              key={dest.id}
              name={dest.name}
              country={dest.country}
              duration={dest.duration}
              signal={dest.signal}
              query={dest.query}
            />
          ))}
        </motion.div>
      </StaggerSection>

      {/* Closing editorial line */}
      <StaggerSection index={4} className="mt-24 border-t border-[var(--color-border-soft)] pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
          <SectionEyebrow>Why Nomad</SectionEyebrow>
          <div className="max-w-[640px]">
            <p className="font-display text-[28px] font-bold leading-[1.3] text-[var(--color-ink)]">
              We read the <span className="text-wander">YouTube vlogs</span>, the
              <span className="text-wander"> Reddit threads</span>, the blogs nobody else finds.
              Then we write you a day-by-day itinerary that reads like a friend made it.
            </p>
            <p className="mt-6 text-[14px] text-[var(--color-muted)]">
              Not another generic top-10 list. Not another sponsored content. Real travellers,
              real tips, organised by hour.
            </p>
          </div>
        </div>
      </StaggerSection>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
      {children}
    </span>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
