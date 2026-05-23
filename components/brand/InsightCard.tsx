import * as React from "react";
import { SourceBadge } from "@/components/brand/SourceBadge";
import type { SourceKey } from "@/data/placeholders";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  icon: string;
  title: string;
  body: string;
  source: SourceKey;
  destTag: string;
  className?: string;
}

export function InsightCard({ icon, title, body, source, destTag, className }: InsightCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-[20px] border-[1.5px] border-[var(--color-border-soft)] bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-ember-light)] text-[20px]">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[17px] font-bold leading-snug text-[var(--color-ink)]">
            {title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.55] text-[var(--color-muted)]">{body}</p>
          <div className="mt-3 flex items-center gap-2">
            <SourceBadge source={source} />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              · {destTag}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
