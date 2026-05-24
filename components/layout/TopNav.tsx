"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NomadLogo } from "@/components/brand/NomadLogo";
import { UserAvatar } from "@/components/brand/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/trips", label: "My Trips" },
  { href: "/plan", label: "Plan" },
  { href: "/profile", label: "Profile" },
];

export function TopNav() {
  useInitializeAuth();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    null;
  const avatarUrl = profile?.avatarUrl ?? (user?.user_metadata?.avatar_url as string | undefined);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border-soft)] bg-[var(--color-cream)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-8">
        <NomadLogo />

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-[100px] px-4 py-2 text-[14px] font-medium transition-colors duration-150",
                  active
                    ? "text-[var(--color-ink)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-ember)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link href="/profile" className="flex items-center gap-3 group">
          <UserAvatar url={avatarUrl} name={displayName} email={user?.email} size={36} />
          <div className="hidden md:block text-right leading-tight">
            <div className="text-[13px] font-medium text-[var(--color-ink)]">
              {displayName?.split(" ")[0] ?? "You"}
            </div>
            <div className="text-[11px] text-[var(--color-muted)]">View profile</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
