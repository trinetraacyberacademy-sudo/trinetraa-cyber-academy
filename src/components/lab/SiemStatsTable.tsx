const groupByOptions = [
  { value: "sourcetype", label: "sourcetype" },
  { value: "department", label: "department" },
  { value: "employee", label: "employee" },
  { value: "ticket", label: "ticket" },
];

function groupCount<T>(items: T[], keyOf: (item: T) => string | null): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    if (key === null) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count }));
}

export function SiemStatsTable({
  results,
  groupBy,
  onChangeHref,
}: {
  results: {
    sourceType: string;
    employee: { name: string; department: string } | null;
    relatedTicket: { ticketNumber: string } | null;
  }[];
  groupBy: string;
  onChangeHref: (groupBy: string) => string;
}) {
  const rows =
    groupBy === "department"
      ? groupCount(results, (r) => r.employee?.department ?? null)
      : groupBy === "employee"
        ? groupCount(results, (r) => r.employee?.name ?? null)
        : groupBy === "ticket"
          ? groupCount(results, (r) => r.relatedTicket?.ticketNumber ?? null)
          : groupCount(results, (r) => r.sourceType);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">count by</span>
        {groupByOptions.map((opt) => (
          <a
            key={opt.value}
            href={onChangeHref(opt.value)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              groupBy === opt.value
                ? "border-signal-500/50 bg-signal-500/10 text-signal-300"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] tracking-wide text-slate-500 uppercase">
              <th className="px-5 py-3 font-medium">{groupBy}</th>
              <th className="px-5 py-3 font-medium">count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-white/[0.03]">
                <td className="px-5 py-3 text-slate-200">{row.key}</td>
                <td className="px-5 py-3 font-mono text-signal-400">{row.count}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-slate-500">
                  No data for this grouping.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
