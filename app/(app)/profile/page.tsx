"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UserAvatar } from "@/components/brand/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StaggerSection } from "@/components/layout/StaggerSection";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const updateDisplayName = useAuthStore((s) => s.updateDisplayName);
  const signOut = useAuthStore((s) => s.signOut);

  const [editing, setEditing] = React.useState(false);
  const [savingName, setSavingName] = React.useState(false);
  const [pendingName, setPendingName] = React.useState("");

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.full_name as string | undefined) ??
    "Traveller";
  const avatarUrl = profile?.avatarUrl ?? (user?.user_metadata?.avatar_url as string | undefined);

  const handleSave = async () => {
    const name = pendingName.trim();
    if (!name || name === displayName) {
      setEditing(false);
      return;
    }
    setSavingName(true);
    try {
      await updateDisplayName(name);
      toast.success("Name updated");
      setEditing(false);
    } catch {
      toast.error("Couldn't save name");
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin");
  };

  return (
    <div className="mx-auto max-w-[640px] px-8 pt-20 pb-24">
      <StaggerSection index={0}>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
          Your account
        </span>
        <h1 className="mt-3 font-display text-[48px] font-extrabold leading-[1.05] text-[var(--color-ink)]">
          Profile
        </h1>
      </StaggerSection>

      <StaggerSection index={1}>
        <div className="mt-12 flex flex-col items-center text-center">
          <UserAvatar url={avatarUrl} name={displayName} email={user?.email} size={120} />
          <h2 className="mt-6 font-display text-[32px] font-bold text-[var(--color-ink)]">
            {displayName}
          </h2>
          <p className="mt-1 text-[14px] text-[var(--color-muted)]">{user?.email}</p>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setPendingName(displayName);
              setEditing(true);
            }}
            className="mt-6"
          >
            Edit name
          </Button>
        </div>
      </StaggerSection>

      <StaggerSection index={2}>
        <div className="mt-16 border-t border-[var(--color-border-soft)] pt-8 text-center">
          <Button variant="ghost" size="md" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </StaggerSection>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogTitle>Edit your name</DialogTitle>
        <DialogDescription>
          This is how Nomad will greet you and how trips are credited.
        </DialogDescription>
        <Input
          value={pendingName}
          onChange={(e) => setPendingName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={savingName}>
            Save
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
