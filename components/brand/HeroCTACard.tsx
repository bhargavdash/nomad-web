"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { unsplashByQuery } from "@/lib/unsplash";

export function HeroCTACard() {
  return (
    <Link
      href="/plan"
      className="group relative block overflow-hidden rounded-[24px] shadow-card transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative h-[400px] w-full">
        <Image
          src={unsplashByQuery("jaisalmer desert sunset", 1200, 800)}
          alt="Plan your next trip"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-navy-3)]/90 via-[var(--color-navy-3)]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ember)] mb-4">
            Ready when you are
          </span>
          <h2 className="font-display text-[44px] font-extrabold leading-[1.05] text-[var(--color-cream)] max-w-[480px]">
            Where will the <span className="text-wander">wander</span> take you?
          </h2>
          <p className="mt-3 max-w-[420px] text-[15px] text-white/65">
            Tell us the vibe. We&apos;ll write the itinerary — pulled from real travellers, not
            sponsored lists.
          </p>
          <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-[100px] bg-[var(--color-ember)] px-6 py-3 text-[14px] font-medium text-white shadow-ember-hover transition-transform group-hover:translate-x-1">
            Plan a new trip
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
