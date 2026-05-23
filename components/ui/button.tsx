"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-navy)] text-[var(--color-cream)] hover:bg-[var(--color-navy-2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
  accent:
    "bg-[var(--color-ember)] text-white hover:bg-[var(--color-ember-dim)] hover:shadow-ember-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-cream-2)] active:scale-[0.98]",
  outline:
    "bg-transparent text-[var(--color-ink)] border-[1.5px] border-[var(--color-border-soft)] hover:border-[var(--color-ink)] active:scale-[0.98]",
  dark:
    "bg-[var(--color-warm-white)] text-[var(--color-ink)] border-[1.5px] border-[var(--color-border-soft)] hover:bg-white active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-12 px-6 text-[14px]",
  lg: "h-14 px-8 text-[15px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[100px] font-sans font-medium tracking-[0.01em] transition-all duration-150",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
