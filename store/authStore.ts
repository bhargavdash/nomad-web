import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase/client";
import type { ApiProfile } from "@/types/api";

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: ApiProfile | null;
  initialized: boolean;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: () => void;
  fetchProfile: () => Promise<void>;
  syncProfile: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,
  loading: false,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),

  setInitialized: () => set({ initialized: true }),

  fetchProfile: async () => {
    try {
      const res = await api.get<{ profile: ApiProfile }>("/auth/me");
      set({ profile: res.data.profile });
    } catch {
      // fall back to user_metadata in UI
    }
  },

  syncProfile: async () => {
    try {
      const res = await api.post<{ profile: ApiProfile }>("/auth/sync");
      set({ profile: res.data.profile });
    } catch (err) {
      console.warn("[authStore] /auth/sync failed:", err);
    }
  },

  updateDisplayName: async (name: string) => {
    const res = await api.patch<{ profile: ApiProfile }>("/profile", {
      display_name: name,
    });
    set({ profile: res.data.profile });
  },

  signOut: async () => {
    set({ loading: true });
    await supabase().auth.signOut();
    set({ session: null, user: null, profile: null, loading: false });
  },
}));
