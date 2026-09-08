"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search, Ticket } from "lucide-react";

const tools = [
  { href: "/dashboard/tickets", label: "TrinetraTicket", icon: Ticket },
  { href: "/dashboard/siem", label: "TrinetraSIEM", icon: Search },
];

export function LabHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <nav className="flex items-center gap-1">
            {tools.map((tool) => {
              const active = pathname?.startsWith(tool.href);
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-signal-500/15 text-signal-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tool.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <span className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
          Lab Environment
        </span>
      </div>
    </header>
  );
}
