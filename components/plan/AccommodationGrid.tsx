"use client";

import * as React from "react";
import { ACCOMMODATION_OPTIONS } from "@/data/placeholders";
import type { AccommodationType } from "@/store/tripPlanStore";
import { cn } from "@/lib/utils";

interface AccommodationGridProps {
  value: AccommodationType;
  onChange: (value: AccommodationType) => void;
}

export function AccommodationGrid({ value, onChange }: AccommodationGridProps) {
  return (
    <div role="radiogroup" aria-label="Accommodation" className="flex flex-col gap-3">
      {ACCOMMODATION_OPTIONS.map((label) => {
        const active = value === label;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(label)}
            className={cn(
              "flex items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left transition-all duration-150",
              active
                ? "border-[var(--color-ember)] bg-[var(--color-ember-light)] shadow-card"
                : "border-[var(--color-border-soft)] bg-white hover:border-[var(--color-ink)]",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-150",
                active ? "border-[var(--color-ember)]" : "border-[var(--color-border-soft)]",
              )}
            >
              {active && (
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ember)]" />
              )}
            </span>
            <span className="text-label-m text-[var(--color-ink)]">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
