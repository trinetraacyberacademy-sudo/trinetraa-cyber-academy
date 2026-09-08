import Link from "next/link";

type Facet = { label: string; count: number; addQuery: string };
type FacetGroup = { title: string; field: string; facets: Facet[] };

function topCounts(values: string[], limit = 6): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

export function buildFacetGroups(
  results: {
    sourceType: string;
    employee: { name: string; department: string } | null;
    relatedTicket: { ticketNumber: string } | null;
  }[],
): FacetGroup[] {
  const groups: FacetGroup[] = [];

  const sourceTypes = topCounts(results.map((r) => r.sourceType));
  if (sourceTypes.length > 0) {
    groups.push({
      title: "sourcetype",
      field: "sourcetype",
      facets: sourceTypes.map((s) => ({
        label: s.value,
        count: s.count,
        addQuery: `sourcetype=${s.value}`,
      })),
    });
  }

  const departments = topCounts(
    results.filter((r) => r.employee).map((r) => r.employee!.department),
  );
  if (departments.length > 0) {
    groups.push({
      title: "department",
      field: "department",
      facets: departments.map((d) => ({
        label: d.value,
        count: d.count,
        addQuery: `department=${d.value}`,
      })),
    });
  }

  const employees = topCounts(results.filter((r) => r.employee).map((r) => r.employee!.name));
  if (employees.length > 0) {
    groups.push({
      title: "employee",
      field: "employee",
      facets: employees.map((e) => ({
        label: e.value,
        count: e.count,
        addQuery: `employee="${e.value}"`,
      })),
    });
  }

  const tickets = topCounts(
    results.filter((r) => r.relatedTicket).map((r) => r.relatedTicket!.ticketNumber),
  );
  if (tickets.length > 0) {
    groups.push({
      title: "ticket",
      field: "ticket",
      facets: tickets.map((t) => ({
        label: t.value,
        count: t.count,
        addQuery: `ticket=${t.value}`,
      })),
    });
  }

  return groups;
}

export function SiemFieldsSidebar({
  groups,
  currentQuery,
}: {
  groups: FacetGroup[];
  currentQuery: string;
}) {
  if (groups.length === 0) return null;

  return (
    <div className="w-56 shrink-0 space-y-5">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Interesting Fields
      </p>
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-[11px] font-medium text-slate-400">{group.title}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.facets.map((f) => (
              <li key={f.label}>
                <Link
                  href={`/dashboard/siem?q=${encodeURIComponent(
                    currentQuery ? `${currentQuery} AND ${f.addQuery}` : f.addQuery,
                  )}`}
                  className="flex items-center justify-between gap-2 rounded px-1.5 py-1 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <span className="truncate">{f.label}</span>
                  <span className="shrink-0 text-slate-500">{f.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
