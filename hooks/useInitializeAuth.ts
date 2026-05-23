"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function useInitializeAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const syncProfile = useAuthStore((s) => s.syncProfile);

  useEffect(() => {
    const sb = supabase();

    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitialized();
      if (data.session) {
        syncProfile().then(() => fetchProfile());
      }
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        syncProfile().then(() => fetchProfile());
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [setSession, setInitialized, fetchProfile, syncProfile]);
}
