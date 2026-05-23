import * as React from "react";
import { SOURCE_BADGE_COLORS, type SourceKey } from "@/data/placeholders";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: SourceKey;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const spec = SOURCE_BADGE_COLORS[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[100px] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.05em] backdrop-blur-md",
        className,
      )}
      style={{ background: spec.bg, color: spec.text }}
    >
      {spec.label}
    </span>
  );
}
