"use client";

import * as React from "react";
import { ACCOMMODATION_OPTIONS } from "@/data/placeholders";
import type { AccommodationType } from "@/store/tripPlanStore";
import { cn } from "@/lib/utils";

interface AccommodationGridProps {
  value: AccommodationType | null;
  onChange: (value: AccommodationType) => void;
}

export function AccommodationGrid({ value, onChange }: AccommodationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {ACCOMMODATION_OPTIONS.map((opt) => {
        const active = value === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.label as AccommodationType)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-[18px] border-[1.5px] p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
              active
                ? "border-[var(--color-ember)] bg-[var(--color-ember-light)] shadow-card"
                : "border-[var(--color-border-soft)] bg-white hover:border-[var(--color-ink)]",
            )}
          >
            <span className="text-[24px]">{opt.icon}</span>
            <span className="font-display text-[15px] font-bold text-[var(--color-ink)]">
              {opt.label}
            </span>
            <span className="text-[12px] leading-[1.45] text-[var(--color-muted)]">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
