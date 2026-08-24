"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { courses } from "@/lib/site-data";

const tabs = [
  { key: "all", label: "All Programs" },
  { key: "program", label: "Full Programs" },
  { key: "workshop", label: "Workshops" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function CourseFilterTabs() {
  const [active, setActive] = useState<TabKey>("all");

  const filtered =
    active === "all" ? courses : courses.filter((c) => c.type === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter programs"
        className="mx-auto flex w-fit gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === tab.key ? "text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {active === tab.key && (
              <motion.span
                layoutId="course-filter-pill"
                className="absolute inset-0 rounded-full bg-signal-600"
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {filtered.map((course, i) => (
          <CourseCard key={course.slug} course={course} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
}
