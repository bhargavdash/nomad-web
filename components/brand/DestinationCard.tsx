"use client";

import * as React from "react";
import { RemoteImage } from "@/components/brand/RemoteImage";

interface DestinationCardProps {
  name: string;
  country: string;
  duration: string;
  signal: string;
  /** Pre-resolved image URL (baked into the static trending data). */
  imageUrl?: string | null;
  /** Used only for the on-error fallback if `imageUrl` ever fails to load. */
  fallbackQuery?: string;
  onClick?: () => void;
}

export function DestinationCard({
  name,
  country,
  duration,
  signal,
  imageUrl,
  fallbackQuery,
  onClick,
}: DestinationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-[280px] shrink-0 overflow-hidden rounded-[20px] text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-[360px] w-full">
        <RemoteImage
          src={imageUrl}
          fallbackQuery={fallbackQuery ?? `${name} ${country}`}
          alt={`${name}, ${country}`}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute left-5 top-5">
          <span className="rounded-[100px] bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur-md">
            {signal}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="font-display text-[28px] font-extrabold leading-tight text-white">
            {name}
          </div>
          <div className="mt-1 text-[13px] text-white/70">{country}</div>
          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/55">
            {duration}
          </div>
        </div>
      </div>
    </button>
  );
}
