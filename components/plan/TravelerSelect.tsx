"use client";

import * as React from "react";
import { Users, Check } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverClose,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TRAVELER_OPTIONS } from "@/data/placeholders";

interface TravelerSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

function labelFor(value: string | null): string | null {
  if (!value) return null;
  const match = TRAVELER_OPTIONS.find((opt) => opt.value === value);
  // Legacy trips may carry non-numeric values ("3+", "large") — show them as-is.
  return match ? match.label : value;
}

// Rendered inside PopoverContent so it can close the popover on select — a
// single-select dropdown should dismiss the moment a number is chosen.
function TravelerOptionList({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) {
  const close = usePopoverClose();
  return (
    <ul role="listbox" aria-label="Number of travelers">
      {TRAVELER_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <li key={opt.value}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                onChange(opt.value);
                close();
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left font-sans text-[14px] transition-colors",
                active
                  ? "bg-[var(--color-ember-light)] text-[var(--color-ember)]"
                  : "text-[var(--color-ink)] hover:bg-[var(--color-cream)]",
              )}
            >
              <span>{opt.label}</span>
              {active && <Check size={16} className="shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function TravelerSelect({ value, onChange }: TravelerSelectProps) {
  const selectedLabel = labelFor(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-[16px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-warm-white)] px-5 text-left font-sans text-[15px] transition-colors",
            "hover:border-[var(--color-ink)]",
            selectedLabel ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]",
          )}
        >
          <Users size={18} className="shrink-0 text-[var(--color-ember)]" />
          <span className="flex-1">{selectedLabel ?? "How many travelers?"}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-[var(--color-muted)]"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[280px] w-[260px] overflow-y-auto">
        <TravelerOptionList value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
