"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, MoreVertical } from "lucide-react";

import { SourceBadge } from "@/components/brand/SourceBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TripStop } from "@/types/api";
import { unsplashByQuery } from "@/lib/unsplash";
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
        "relative overflow-hidden rounded-[20px] shadow-postcard transition-all duration-200",
        stop.locked
          ? "border-[1.5px] border-[var(--color-ember)] bg-[var(--color-ember-light)]"
          : "bg-[var(--color-card-dark)]",
      )}
    >
      {/* Photo */}
      <div className="relative h-[220px] w-full">
        <Image
          src={unsplashByQuery(stop.name, 800, 600)}
          alt={stop.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 560px, 90vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />

        <button
          onClick={onLockToggle}
          aria-label={stop.locked ? "Unlock" : "Lock"}
          className={cn(
            "absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all",
            stop.locked
              ? "bg-[var(--color-ember)] text-white"
              : "bg-black/30 text-white hover:bg-black/50",
          )}
        >
          <Lock size={15} />
        </button>

        {stop.source && (
          <div className="absolute right-4 top-4">
            <SourceBadge source={stop.source} />
          </div>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Options"
              className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
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

      {/* Body */}
      <div
        className={cn("px-6 py-5", stop.locked ? "text-[var(--color-ink)]" : "text-white")}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={cn(
              "font-display text-[22px] font-bold leading-tight",
              stop.locked ? "text-[var(--color-ink)]" : "text-white",
            )}
          >
            {stop.name}
          </h3>
          {stop.duration && (
            <span
              className={cn(
                "shrink-0 font-mono text-[11px] uppercase tracking-[0.1em]",
                stop.locked ? "text-[var(--color-muted)]" : "text-white/55",
              )}
            >
              {stop.duration}
            </span>
          )}
        </div>

        {stop.description && (
          <p
            className={cn(
              "mt-2 text-[14px] leading-[1.55]",
              stop.locked ? "text-[var(--color-ink)]/70" : "text-white/55",
            )}
          >
            {stop.description}
          </p>
        )}

        {stop.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {stop.tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-[100px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]",
                  stop.locked
                    ? "bg-[var(--color-ember)]/15 text-[var(--color-ember-dim)]"
                    : "bg-white/10 text-white/65",
                )}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
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
