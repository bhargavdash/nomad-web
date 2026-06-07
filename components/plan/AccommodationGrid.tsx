"use client";

import * as React from "react";
import { Home, Star, Feather, Users, Key, Moon, PlusCircle, type LucideIcon } from "lucide-react";
import { ACCOMMODATION_OPTIONS } from "@/data/placeholders";
import type { AccommodationType } from "@/store/tripPlanStore";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  star: Star,
  feather: Feather,
  users: Users,
  key: Key,
  moon: Moon,
  "plus-circle": PlusCircle,
};

interface AccommodationGridProps {
  value: AccommodationType | null;
  onChange: (value: AccommodationType | null) => void;
}

export function AccommodationGrid({ value, onChange }: AccommodationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {ACCOMMODATION_OPTIONS.map((opt) => {
        const active = value === opt.label;
        const IconComponent = ICON_MAP[opt.icon] ?? Home;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(active ? null : (opt.label as AccommodationType))}
            className={cn(
              "flex flex-col items-start gap-2 rounded-[18px] border-[1.5px] p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
              active
                ? "border-[var(--color-ember)] bg-[var(--color-ember-light)] shadow-card"
                : "border-[var(--color-border-soft)] bg-white hover:border-[var(--color-ink)]",
            )}
          >
            <IconComponent
              size={22}
              strokeWidth={1.5}
              className={active ? "text-[var(--color-ember)]" : "text-[var(--color-ink)]"}
            />
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
