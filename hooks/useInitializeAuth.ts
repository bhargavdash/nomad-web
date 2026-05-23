"use client";

import { useEffect } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function useInitializeAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const syncProfile = useAuthStore((s) => s.syncProfile);

  useEffect(() => {
    const sb = supabase();

    const initialize = async () => {
      const { data } = await sb.auth.getSession();
      setSession(data.session);
      setInitialized();
      if (data.session) {
        await syncProfile();
        await fetchProfile();
      }
    };

    initialize();

    const { data: sub } = sb.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session) {
        syncProfile().then(() => fetchProfile());
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [setSession, setInitialized, fetchProfile, syncProfile]);
}
