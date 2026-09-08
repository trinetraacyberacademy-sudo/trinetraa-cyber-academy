"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";

const options = [
  { value: "all", label: "All time" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function SiemTimeRangePicker({ range }: { range: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("range");
    } else {
      params.set("range", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative">
      <Clock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <select
        value={range}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none rounded-lg border border-white/10 bg-ink-900 py-2.5 pr-8 pl-9 text-sm text-slate-200 focus:border-signal-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
