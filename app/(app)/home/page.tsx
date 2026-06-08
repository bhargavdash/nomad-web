"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { ActiveTripCard } from "@/components/brand/ActiveTripCard";
import { DestinationCard } from "@/components/brand/DestinationCard";
import { HeroCTACard } from "@/components/brand/HeroCTACard";
import { StaggerSection } from "@/components/layout/StaggerSection";
import { DEMO_TRIP } from "@/data/placeholders";
import { api } from "@/lib/api";
import { unsplashByQuery } from "@/lib/unsplash";
import { useAuthStore } from "@/store/authStore";
import type { TripSummary, TrendingDest, TrendingResponse } from "@/types/api";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const [activeTrip, setActiveTrip] = React.useState<TripSummary | null>(null);
  const [tripsLoading, setTripsLoading] = React.useState(true);
  const [trending, setTrending] = React.useState<TrendingResponse | null>(null);

  const handleTrendingPick = React.useCallback(
    (dest: TrendingDest) => {
      const params = new URLSearchParams({
        from: "trending",
        dest: dest.name,
        country: dest.country,
        duration: dest.duration,
        blurb: dest.blurb,
        vibes: dest.vibe_tags.join(","),
      });
      router.push(`/plan?${params.toString()}`);
    },
    [router],
  );

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
        setTripsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setTripsLoading(false);
        const status = err?.response?.status;
        if (status && status !== 401) {
          toast.error("Couldn't load your active trip");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    api
      .get<TrendingResponse>("/trending")
      .then((res) => {
        if (cancelled) return;
        setTrending(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status && status !== 401) {
          toast.error("Couldn't load trending destinations");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-24">
      {/* Greeting */}
      <StaggerSection index={0} className="pt-12">
        <h1 className="mt-3 max-w-[820px] font-display text-[64px] font-extrabold leading-[1.02] text-[var(--color-ink)]">
          Good {getTimeOfDay()}, <span className="text-wander">{firstName}</span>.
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] text-[var(--color-muted)]">
          What kind of trip are you in the mood for? Tell us a vibe — we&apos;ll dig through the
          real internet so you don&apos;t have to.
        </p>
      </StaggerSection>

      {/* Hero — full width now that the insights column is gone (SA-8) */}
      <StaggerSection index={1} className="mt-14">
        {tripsLoading ? (
          <HeroSkeleton />
        ) : activeTrip ? (
          <ActiveTripCard
            destination={activeTrip.destination}
            dateFrom={activeTrip.dateFrom ?? DEMO_TRIP.dates.from}
            dateTo={activeTrip.dateTo ?? DEMO_TRIP.dates.to}
            duration={activeTrip.durationDays ?? DEMO_TRIP.duration}
            imageUrl={activeTrip.heroImageUrl}
            href={`/trips/${activeTrip.id}`}
            priority
          />
        ) : (
          <HeroCTACard />
        )}
      </StaggerSection>

      {/* Trending — two LLM-driven rows: India + International */}
      <TrendingRow
        index={2}
        eyebrow="Where Indians are heading"
        title={
          <>
            Trending in <span className="text-wander">India</span>
          </>
        }
        destinations={trending?.india ?? null}
        onPick={handleTrendingPick}
        priorityFirst
      />
      <TrendingRow
        index={3}
        eyebrow="Indian passport · easy entry"
        title={
          <>
            Trending <span className="text-wander">internationally</span>
          </>
        }
        destinations={trending?.international ?? null}
        onPick={handleTrendingPick}
        className="mt-16"
      />

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

type TrendingRowProps = {
  index: number;
  eyebrow: string;
  title: React.ReactNode;
  destinations: TrendingDest[] | null;
  onPick: (dest: TrendingDest) => void;
  className?: string;
  /** Preload the first card's image as the LCP (only for the top row). */
  priorityFirst?: boolean;
};

function TrendingRow({
  index,
  eyebrow,
  title,
  destinations,
  onPick,
  className,
  priorityFirst,
}: TrendingRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const isLoading = destinations === null;
  const isEmpty = !isLoading && destinations.length === 0;

  return (
    <StaggerSection index={index} className={className ?? "mt-20"}>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-[36px] font-extrabold leading-tight text-[var(--color-ink)]">
            {title}
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
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <TrendingCardSkeleton key={i} />)
          : isEmpty
            ? <EmptyTrending />
            : destinations.map((dest, i) => (
                <DestinationCard
                  key={`${dest.name}-${i}`}
                  name={dest.name}
                  country={dest.country}
                  duration={dest.duration}
                  imageUrl={dest.imageUrl ?? unsplashByQuery(`${dest.name} ${dest.country}`)}
                  fallbackQuery={`${dest.name} ${dest.country}`}
                  priority={priorityFirst === true && i === 0}
                  onClick={() => onPick(dest)}
                />
              ))}
      </motion.div>
    </StaggerSection>
  );
}

function HeroSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-[24px] bg-[var(--color-cream-2)] p-8 shadow-active-trip animate-pulse h-[400px]">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="h-3 w-20 rounded-full bg-[var(--color-border-soft)]" />
          <div className="mt-6 h-9 w-64 rounded-[10px] bg-[var(--color-border-soft)]" />
          <div className="mt-3 h-4 w-48 rounded-full bg-[var(--color-border-soft)]" />
        </div>
        <div>
          <div className="mb-6 grid grid-cols-3 gap-4 border-t border-[var(--color-border-soft)] pt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 w-12 rounded-[8px] bg-[var(--color-border-soft)]" />
                <div className="mt-2 h-2.5 w-16 rounded-full bg-[var(--color-border-soft)]" />
              </div>
            ))}
          </div>
          <div className="h-4 w-32 rounded-full bg-[var(--color-border-soft)]" />
        </div>
      </div>
    </div>
  );
}

function TrendingCardSkeleton() {
  return (
    <div className="w-[280px] shrink-0 overflow-hidden rounded-[20px]">
      <div className="h-[360px] w-full animate-pulse bg-[var(--color-cream-2)]" />
    </div>
  );
}

function EmptyTrending() {
  return (
    <div className="w-full rounded-[20px] border border-[var(--color-border-soft)] bg-[var(--color-warm-white)] py-12 text-center text-[14px] text-[var(--color-muted)]">
      Refreshing trending picks for this season — check back in a minute.
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
