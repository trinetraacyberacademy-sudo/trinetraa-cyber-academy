"use client";

import { useEffect } from "react";

// Marks <html> as hydrated so the beforeInteractive fallback script in
// layout.tsx knows real hydration succeeded and should never force-reveal
// content that's legitimately still waiting to scroll into view.
export function HydrationSignal() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  return null;
}
