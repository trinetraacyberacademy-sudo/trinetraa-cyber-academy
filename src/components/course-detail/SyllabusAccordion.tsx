"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { syllabusGroups } from "@/lib/site-data";

const colorMap: Record<
  string,
  { badge: string; chip: string; bar: string }
> = {
  slate: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    chip: "bg-slate-50 text-slate-600 border-slate-200",
    bar: "bg-slate-400",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    chip: "bg-blue-50 text-blue-600 border-blue-100",
    bar: "bg-blue-500",
  },
  signal: {
    badge: "bg-signal-50 text-signal-700 border-signal-200",
    chip: "bg-signal-50 text-signal-600 border-signal-100",
    bar: "bg-signal-500",
  },
  flare: {
    badge: "bg-flare-50 text-flare-700 border-flare-200",
    chip: "bg-flare-50 text-flare-600 border-flare-100",
    bar: "bg-flare-500",
  },
};

export function SyllabusAccordion() {
  const [openIds, setOpenIds] = useState<string[]>(["foundations"]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="mt-14 space-y-4">
      {syllabusGroups.map((group) => {
        const open = openIds.includes(group.id);
        const colors = colorMap[group.color];

        return (
          <div
            key={group.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50 sm:px-7"
            >
              <span className={`h-9 w-1.5 shrink-0 rounded-full ${colors.bar}`} aria-hidden />
              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${colors.badge}`}
              >
                {group.levelLabel}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold text-slate-900">
                  {group.title}
                </span>
                <span className="block text-xs text-slate-500">
                  {group.weeksLabel} &middot; {group.modules.length} modules
                </span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 border-t border-slate-100 px-6 py-6 sm:grid-cols-2 sm:px-7">
                    {group.modules.map((mod) => (
                      <div
                        key={mod.title}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          {"code" in mod && mod.code ? (
                            <span className="font-mono text-[11px] font-semibold tracking-wide text-slate-400">
                              {mod.code}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${colors.chip}`}
                          >
                            {mod.tool}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-slate-900">
                          {mod.title}
                        </h4>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">
                          {mod.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
