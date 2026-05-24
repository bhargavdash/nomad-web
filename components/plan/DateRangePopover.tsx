"use client";

import * as React from "react";
import { DayPicker, type DateRange as DRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/store/tripPlanStore";

interface DateRangePopoverProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangePopover({ value, onChange }: DateRangePopoverProps) {
  const selected: DRange | undefined =
    value.from && value.to
      ? { from: new Date(value.from), to: new Date(value.to) }
      : value.from
        ? { from: new Date(value.from), to: undefined }
        : undefined;

  const handleSelect = (range: DRange | undefined) => {
    onChange({
      from: range?.from ? format(range.from, "yyyy-MM-dd") : null,
      to: range?.to ? format(range.to, "yyyy-MM-dd") : null,
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ from: null, to: null });
  };

  const label =
    value.from && value.to
      ? `${format(new Date(value.from), "MMM d")} → ${format(new Date(value.to), "MMM d, yyyy")}`
      : value.from
        ? `${format(new Date(value.from), "MMM d, yyyy")} → pick end date`
        : "Pick travel dates";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-[16px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-warm-white)] px-5 text-left font-sans text-[15px] transition-colors",
            "hover:border-[var(--color-ink)]",
            value.from ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]",
          )}
        >
          <CalendarIcon size={18} className="shrink-0 text-[var(--color-ember)]" />
          <span className="flex-1">{label}</span>
          {(value.from || value.to) && (
            <span
              role="button"
              aria-label="Clear dates"
              onClick={handleClear}
              className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)]"
            >
              <X size={13} />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[640px] p-4">
        <style>{`
          .rdp { --rdp-accent-color: var(--color-ember); --rdp-accent-background-color: var(--color-ember-light); margin: 0; }
          .rdp-day_button { border-radius: 999px; font-family: var(--font-sans); }
          .rdp-day_button:hover { background: var(--color-cream-2); }
          .rdp-selected .rdp-day_button { background: var(--color-ember) !important; color: white !important; }
          .rdp-range_middle .rdp-day_button { background: var(--color-ember-light) !important; color: var(--color-ink) !important; }
          .rdp-caption_label, .rdp-month_caption { font-family: var(--font-display); font-weight: 700; font-size: 16px; }
          .rdp-weekday { font-family: var(--font-mono); text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: var(--color-muted); }
        `}</style>
        <DayPicker
          mode="range"
          numberOfMonths={2}
          selected={selected}
          onSelect={handleSelect}
          disabled={{ before: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}
