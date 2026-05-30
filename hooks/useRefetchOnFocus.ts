"use client";

import * as React from "react";

/**
 * Re-run `refetch` when the tab becomes visible again or the window regains focus.
 * Debounced so a focus + visibilitychange in quick succession only fires once.
 */
export function useRefetchOnFocus(refetch: () => void, enabled = true) {
  const refetchRef = React.useRef(refetch);
  refetchRef.current = refetch;

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let lastRun = 0;
    const run = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRun < 500) return;
      lastRun = now;
      refetchRef.current();
    };
    window.addEventListener("focus", run);
    document.addEventListener("visibilitychange", run);
    return () => {
      window.removeEventListener("focus", run);
      document.removeEventListener("visibilitychange", run);
    };
  }, [enabled]);
}
