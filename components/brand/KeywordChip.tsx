"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface KeywordChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "navy" | "terracotta";
}

export function KeywordChip({ label, active, onClick, variant = "navy" }: KeywordChipProps) {
  const activeClasses =
    variant === "terracotta"
      ? "bg-[var(--color-ember)] text-white border-[var(--color-ember)]"
      : "bg-[var(--color-navy)] text-[var(--color-cream)] border-[var(--color-navy)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[100px] border-[1.5px] px-4 py-2 font-sans text-[13px] font-medium transition-all duration-150 active:scale-[0.98]",
        active
          ? activeClasses
          : "border-[var(--color-border-soft)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]",
      )}
    >
      {label}
    </button>
  );
}
