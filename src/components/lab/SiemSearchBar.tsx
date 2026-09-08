"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SiemSearchBar({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/dashboard/siem?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by employee, email, keyword, or source type..."
          className="w-full rounded-lg border border-white/10 bg-ink-900 py-2.5 pr-4 pl-9 text-sm text-slate-200 placeholder:text-slate-600 focus:border-signal-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-signal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-500"
      >
        Search
      </button>
    </form>
  );
}
