"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site-data";

export function WhatsAppFloat() {
  const pathname = usePathname();
  // Course detail pages have a sticky "Apply Now" bar in the same corner.
  const hasStickyBar = pathname?.startsWith("/courses/");

  return (
    <a
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-4 z-50 flex items-center gap-3 sm:right-6 ${
        hasStickyBar ? "bottom-24 sm:bottom-28" : "bottom-5 sm:bottom-6"
      }`}
    >
      <span className="pointer-events-none hidden rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block">
        Chat with us on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-900/25 transition-transform duration-200 group-hover:scale-105">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping [animation-duration:2.5s]" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </a>
  );
}
