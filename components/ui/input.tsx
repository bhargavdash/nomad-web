"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-[14px] bg-[var(--color-warm-white)] px-4 font-sans text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]",
        "border-[1.5px] outline-none transition-all duration-150",
        invalid
          ? "border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15"
          : "border-[var(--color-border-soft)] focus:border-[var(--color-ember)] focus:ring-[3px] focus:ring-[var(--color-ember)]/15",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full resize-y rounded-[14px] bg-[var(--color-warm-white)] px-4 py-3 font-sans text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]",
      "border-[1.5px] border-[var(--color-border-soft)] outline-none transition-all duration-150",
      "focus:border-[var(--color-ember)] focus:ring-[3px] focus:ring-[var(--color-ember)]/15",
      className,
    )}
    {...props}
  />
));
TextArea.displayName = "TextArea";
