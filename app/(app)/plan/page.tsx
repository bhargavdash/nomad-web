"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/input";
import { KeywordChip } from "@/components/brand/KeywordChip";
import { LocationSearchInput } from "@/components/plan/LocationSearchInput";
import { DateRangePopover } from "@/components/plan/DateRangePopover";
import { AccommodationGrid } from "@/components/plan/AccommodationGrid";
import { StaggerSection } from "@/components/layout/StaggerSection";

import {
  VIBE_CATEGORIES,
  PACE_OPTIONS,
  BUDGET_TIERS,
  TRAVELER_OPTIONS,
} from "@/data/placeholders";
import { api } from "@/lib/api";
import {
  useTripPlanStore,
  type TravelerCount,
  type PaceType,
  type BudgetTier,
} from "@/store/tripPlanStore";

export default function PlanPage() {
  const router = useRouter();
  const store = useTripPlanStore();
  const [submitting, setSubmitting] = React.useState(false);

  const isValid = store.destination.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const durationDays =
        store.dates.from && store.dates.to
          ? Math.max(
              1,
              Math.round(
                (new Date(store.dates.to).getTime() - new Date(store.dates.from).getTime()) /
                  86400000,
              ),
            )
          : null;

      const res = await api.post("/trips", {
        destination: store.destination.trim(),
        date_from: store.dates.from,
        date_to: store.dates.to,
        duration_days: durationDays,
        travelers: store.travelers,
        vibes: store.selectedVibes,
        accommodation: store.accommodation,
        pace: store.pace,
        budget: store.budget,
        preferences: store.preferences.trim() || undefined,
      });

      const { trip } = res.data as { trip: { id: string } };
      store.setCurrentTripId(trip.id);
      router.push(`/trips/${trip.id}/researching`);
    } catch (err) {
      console.error("[Plan] POST /trips failed:", err);
      toast.error("Couldn't create your trip. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-32 pt-12">
      <StaggerSection index={0}>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
          New itinerary
        </span>
        <h1 className="mt-3 max-w-[820px] font-display text-[56px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
          Tell us the <span className="text-wander">vibe</span>. We&apos;ll write the trip.
        </h1>
      </StaggerSection>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr]">
        {/* Left: sticky summary */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <StaggerSection index={1}>
            <div className="rounded-[24px] border-[1.5px] border-[var(--color-border-soft)] bg-white p-7 shadow-card">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Your trip so far
              </span>
              <h3 className="mt-3 font-display text-[24px] font-bold leading-tight text-[var(--color-ink)]">
                {store.destination || "Somewhere unexpected"}
              </h3>

              <SummaryRow
                label="Dates"
                value={
                  store.dates.from && store.dates.to
                    ? `${format(new Date(store.dates.from), "MMM d")} → ${format(
                        new Date(store.dates.to),
                        "MMM d",
                      )}`
                    : "—"
                }
              />
              <SummaryRow label="Travelers" value={store.travelers ?? "—"} />
              <SummaryRow
                label="Vibes"
                value={
                  store.selectedVibes.length > 0
                    ? `${store.selectedVibes.length} picked`
                    : "—"
                }
              />
              <SummaryRow label="Stay" value={store.accommodation ?? "—"} />
              <SummaryRow label="Pace" value={store.pace ?? "—"} />
              <SummaryRow label="Budget" value={store.budget ?? "—"} />

              <Button
                size="lg"
                variant="accent"
                onClick={handleSubmit}
                loading={submitting}
                disabled={!isValid}
                className="mt-8 w-full"
              >
                {submitting ? "Planning…" : "Plan my trip"}
                {!submitting && store.selectedVibes.length > 0 && (
                  <span className="ml-1 rounded-[100px] bg-white/25 px-2 py-0.5 text-[11px] font-mono">
                    {store.selectedVibes.length}
                  </span>
                )}
              </Button>
              {!isValid && (
                <p className="mt-3 text-center text-[12px] text-[var(--color-muted)]">
                  Pick a destination to continue
                </p>
              )}
            </div>
          </StaggerSection>
        </aside>

        {/* Right: form sections */}
        <div className="flex flex-col gap-14">
          <Section index={2} eyebrow="The essentials" title="Where & when?">
            <div className="flex flex-col gap-4">
              <LocationSearchInput value={store.destination} onSelect={store.setDestination} />
              <DateRangePopover value={store.dates} onChange={store.setDates} />
            </div>
            <FieldLabel>Travelers</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {TRAVELER_OPTIONS.map((opt) => (
                <KeywordChip
                  key={opt.value}
                  label={opt.label}
                  active={store.travelers === opt.value}
                  onClick={() => store.setTravelers(opt.value as TravelerCount)}
                />
              ))}
            </div>
          </Section>

          <Section index={3} eyebrow="The mood" title="What's your vibe?">
            {VIBE_CATEGORIES.map((cat) => (
              <div key={cat.label} className="mt-6 first:mt-0">
                <FieldLabel>{cat.label}</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {cat.vibes.map((vibe) => (
                    <KeywordChip
                      key={vibe}
                      label={vibe}
                      active={store.selectedVibes.includes(vibe)}
                      onClick={() => store.toggleVibe(vibe)}
                      variant="terracotta"
                    />
                  ))}
                </div>
              </div>
            ))}
          </Section>

          <Section index={4} eyebrow="Where you'll stay" title="Pick a vibe for the bed">
            <AccommodationGrid value={store.accommodation} onChange={store.setAccommodation} />
          </Section>

          <Section index={5} eyebrow="How you travel" title="The pace">
            <div className="flex flex-wrap gap-2">
              {PACE_OPTIONS.map((opt) => (
                <KeywordChip
                  key={opt}
                  label={opt}
                  active={store.pace === opt}
                  onClick={() => store.setPace(opt as PaceType)}
                  variant="terracotta"
                />
              ))}
            </div>
          </Section>

          <Section index={6} eyebrow="The wallet" title="Budget tier">
            <div className="flex flex-wrap gap-2">
              {BUDGET_TIERS.map((tier) => (
                <KeywordChip
                  key={tier}
                  label={tier}
                  active={store.budget === tier}
                  onClick={() => store.setBudget(tier as BudgetTier)}
                  variant="terracotta"
                />
              ))}
            </div>
          </Section>

          <Section index={7} eyebrow="The fine print" title="Anything else?">
            <TextArea
              value={store.preferences}
              onChange={(e) => store.setPreferences(e.target.value)}
              placeholder="E.g. stroller-friendly paths, late check-in, vegetarian dinners, photo-heavy days..."
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  index,
  eyebrow,
  title,
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <StaggerSection index={index}>
      <span className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--color-ember)]">
        {eyebrow}
      </span>
      <h2 className="mt-2 mb-6 font-display text-[32px] font-bold leading-tight text-[var(--color-ink)]">
        {title}
      </h2>
      {children}
    </StaggerSection>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
      {children}
    </p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-dashed border-[var(--color-border-soft)] pt-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </span>
      <span className="truncate text-right font-sans text-[13px] font-medium text-[var(--color-ink)]">
        {value}
      </span>
    </div>
  );
}
