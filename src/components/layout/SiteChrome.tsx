"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const LAB_PREFIXES = ["/dashboard/tickets", "/dashboard/siem"];

// The lab tools (TrinetraTicket, TrinetraSIEM) render their own dark
// "lab environment" shell instead of the marketing site's nav/footer.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLab = LAB_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isLab) return null;
  return <>{children}</>;
}
