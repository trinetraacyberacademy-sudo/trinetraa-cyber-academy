"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "RESOLVED", label: "Resolved" },
];

const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "PHISHING", label: "Phishing" },
  { value: "MALWARE", label: "Malware" },
  { value: "ENDPOINT", label: "Endpoint" },
  { value: "IDENTITY", label: "Identity" },
  { value: "NETWORK", label: "Network" },
];

const severityOptions = [
  { value: "", label: "All severities" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const sortOptions = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
];

const selectClass =
  "rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-slate-200 focus:border-signal-500 focus:outline-none";

export function TicketFilters({
  status,
  category,
  severity,
  sort,
}: {
  status?: string;
  category?: string;
  severity?: string;
  sort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => update("status", e.target.value)}
        className={selectClass}
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={category ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className={selectClass}
      >
        {categoryOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={severity ?? ""}
        onChange={(e) => update("severity", e.target.value)}
        className={selectClass}
      >
        {severityOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={sort === "asc" ? "asc" : "desc"}
        onChange={(e) => update("sort", e.target.value)}
        className={selectClass}
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
