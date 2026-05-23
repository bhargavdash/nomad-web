"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverCtx = React.createContext<PopoverContextValue | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <PopoverCtx.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverCtx.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
}: {
  children: React.ReactElement;
  asChild?: boolean;
}) {
  const ctx = React.useContext(PopoverCtx);
  if (!ctx) throw new Error("PopoverTrigger must be inside Popover");

  const trigger = asChild ? children : <button type="button">{children}</button>;
  const props = trigger.props as React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  };

  return React.cloneElement(trigger, {
    ref: ctx.triggerRef,
    onClick: (e: React.MouseEvent) => {
      props.onClick?.(e as React.MouseEvent<HTMLElement>);
      ctx.setOpen(!ctx.open);
    },
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLButtonElement> });
}

export function PopoverContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const ctx = React.useContext(PopoverCtx);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ctx?.open) return;
    const onClick = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        !ctx.triggerRef.current?.contains(e.target as Node)
      ) {
        ctx.setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ctx.setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [ctx]);

  if (!ctx) throw new Error("PopoverContent must be inside Popover");

  const alignClass = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align];

  return (
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute top-full z-40 mt-2 min-w-[200px] rounded-[16px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-warm-white)] p-2 shadow-context-menu",
            alignClass,
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
