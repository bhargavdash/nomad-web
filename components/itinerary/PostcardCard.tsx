"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Lock, MoreVertical } from "lucide-react";

import { SourceBadge } from "@/components/brand/SourceBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TripStop } from "@/types/api";
import { cn } from "@/lib/utils";

interface PostcardCardProps {
  stop: TripStop;
  onLockToggle: () => void;
  onRemove: () => void;
  exiting?: boolean;
}

export function PostcardCard({ stop, onLockToggle, onRemove, exiting }: PostcardCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={
        exiting ? { opacity: 0, y: 10, transition: { duration: 0.3 } } : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "relative rounded-[18px] px-5 py-4 text-white transition-all duration-200",
        stop.locked
          ? "border-[1.5px] border-[var(--color-ember)] bg-[var(--color-card-dark)]"
          : "border-[1.5px] border-transparent bg-[var(--color-card-dark)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {(stop.source || stop.duration) && (
            <div className="flex items-center gap-2.5">
              {stop.source && <SourceBadge source={stop.source} />}
              {stop.duration && (
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/45">
                  {stop.duration}
                </span>
              )}
            </div>
          )}
          <h3 className="mt-2 font-display text-[20px] font-bold leading-tight text-white">
            {stop.name}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onLockToggle}
            aria-label={stop.locked ? "Unlock" : "Lock"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all",
              stop.locked
                ? "bg-[var(--color-ember)] text-white"
                : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white",
            )}
          >
            <Lock size={15} />
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Options"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
              >
                <MoreVertical size={15} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-[180px]">
              <MenuItem onClick={onLockToggle}>{stop.locked ? "Unlock" : "Lock this stop"}</MenuItem>
              <MenuItem onClick={onRemove} variant="danger">
                Remove
              </MenuItem>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {stop.description && (
        <p className="mt-2 text-[14px] leading-[1.55] text-white/55">{stop.description}</p>
      )}

      {stop.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stop.tags.map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-[100px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]",
                stop.locked
                  ? "bg-[var(--color-ember)]/20 text-[var(--color-peach)]"
                  : "bg-white/10 text-white/65",
              )}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}

function MenuItem({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition-colors",
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-[var(--color-ink)] hover:bg-[var(--color-cream)]",
      )}
    >
      {children}
    </button>
  );
}
