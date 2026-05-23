import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NomadLogo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/home"
      className={cn(
        "font-display text-[26px] font-extrabold tracking-[-0.02em] leading-none",
        light ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]",
        className,
      )}
    >
      nomad
      <span className="text-[var(--color-ember)]">.</span>
    </Link>
  );
}
