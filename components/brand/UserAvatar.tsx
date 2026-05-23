"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  url?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ url, name, email, size = 40, className }: UserAvatarProps) {
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  if (url) {
    return (
      <Image
        src={url}
        alt={name ?? "User avatar"}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[var(--color-navy)] text-[var(--color-cream)] font-display font-bold",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
