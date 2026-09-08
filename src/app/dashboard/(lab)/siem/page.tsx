import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";
import { parseTrinetraQL, parseRelativeOrAbsoluteDate } from "@/lib/trinetraql";
import { SiemSearchBar } from "@/components/lab/SiemSearchBar";
import { SiemTimeline } from "@/components/lab/SiemTimeline";
import { SiemTimeRangePicker } from "@/components/lab/SiemTimeRangePicker";
import { SiemEventRow } from "@/components/lab/SiemEventRow";
import { SiemFieldsSidebar, buildFacetGroups } from "@/components/lab/SiemFieldsSidebar";
import { SiemStatsTable } from "@/components/lab/SiemStatsTable";
import type { LogSourceType, Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TrinetraSIEM | Trinetraa Cyber Academy",
};

const sourceLabels: Record<LogSourceType, string> = {
  EMAIL_GATEWAY: "Email Gateway",
  ENDPOINT: "Endpoint",
  AUTHENTICATION: "Authentication",
  NETWORK: "Network",
};

const RANGE_SPEC: Record<string, string> = {
  "24h": "-24h",
  "7d": "-7d",
  "30d": "-30d",
};

const PER_PAGE_OPTIONS = [10, 20, 50];

export default async function SiemPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    view?: string;
    range?: string;
    page?: string;
    perPage?: string;
    groupBy?: string;
  }>;
}) {
  await requirePaidStudent();
  const { q, view, range, page, perPage, groupBy } = await searchParams;
  const query = q?.trim() ?? "";
  const activeView = view === "stats" || view === "viz" ? view : "events";
  const activeRange = range && RANGE_SPEC[range] ? range : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const pageSize = PER_PAGE_OPTIONS.includes(Number(perPage)) ? Number(perPage) : 20;

  const parsed = query ? parseTrinetraQL(query) : null;

  let results: Prisma.LogEventGetPayload<{
    include: { employee: true; relatedTicket: true };
  }>[] = [];

  if (parsed && !parsed.isEmpty) {
    const timeFilter: Prisma.LogEventWhereInput = {};
    const rangeSpec = RANGE_SPEC[activeRange];
    const earliest = rangeSpec ? parseRelativeOrAbsoluteDate(rangeSpec, false) : parsed.earliest;
    const latest = rangeSpec ? undefined : (parsed.latest ?? undefined);
    if (earliest || latest) {
      timeFilter.timestamp = {
        ...(earliest ? { gte: earliest } : {}),
        ...(latest ? { lte: latest } : {}),
      };
    }

    const where: Prisma.LogEventWhereInput = parsed.where
      ? { AND: [parsed.where, timeFilter] }
      : timeFilter;

    results = await prisma.logEvent.findMany({
      where,
      orderBy: { timestamp: "desc" },
      include: { employee: true, relatedTicket: true },
      take: 500,
    });
  }

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const pageResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const baseParams = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q, view, range, page, perPage, groupBy, ...overrides };
    for (const [key, val] of Object.entries(merged)) {
      if (val) params.set(key, val);
    }
    return `/dashboard/siem?${params.toString()}`;
  };

  const facetGroups = buildFacetGroups(results);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">TrinetraSIEM</h1>
      <p className="mt-1 text-sm text-slate-400">
        Search with TrinetraQL — field filters, boolean operators, and time ranges.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <div className="min-w-0 flex-1">
          <SiemSearchBar initialQuery={query} />
        </div>
        <SiemTimeRangePicker range={activeRange} />
      </div>

      {parsed && parsed.explanation.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          Parsed as:{" "}
          <span className="font-mono text-slate-400">{parsed.explanation.join(" · ")}</span>
        </p>
      )}

      {!query ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-6 py-16 text-center">
          <SearchIcon className="h-6 w-6 text-slate-500" />
          <p className="text-sm text-slate-400">Enter a TrinetraQL query to search the log index.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-ink-900/60 px-6 py-16 text-center">
          <p className="text-sm text-slate-400">
            No log events matched <span className="font-mono">{query}</span>.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-1 border-b border-white/10">
            <Link
              href={baseParams({ view: undefined, page: undefined })}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                activeView === "events"
                  ? "border-signal-500 text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Events
            </Link>
            <Link
              href={baseParams({ view: "stats" })}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                activeView === "stats"
                  ? "border-signal-500 text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Statistics
            </Link>
            <Link
              href={baseParams({ view: "viz" })}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                activeView === "viz"
                  ? "border-signal-500 text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Visualization
            </Link>
            <span className="ml-auto pb-2 text-xs text-slate-500">
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-4 flex gap-6">
            {activeView === "events" && (
              <SiemFieldsSidebar groups={facetGroups} currentQuery={query} />
            )}

            <div className="min-w-0 flex-1 space-y-4">
              {activeView === "events" && (
                <>
                  {pageResults.map((log) => (
                    <SiemEventRow
                      key={log.id}
                      sourceLabel={sourceLabels[log.sourceType]}
                      timestampLabel={log.timestamp.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      employeeLabel={
                        log.employee ? `${log.employee.name} · ${log.employee.department}` : null
                      }
                      eventSummary={log.eventSummary}
                      rawLogLine={log.rawLogLine}
                      relatedTicket={log.relatedTicket}
                    />
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Per page</span>
                      {PER_PAGE_OPTIONS.map((n) => (
                        <Link
                          key={n}
                          href={baseParams({ perPage: String(n), page: undefined })}
                          className={`rounded px-2 py-1 ${
                            pageSize === n
                              ? "bg-signal-500/10 text-signal-300"
                              : "hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {n}
                        </Link>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Link
                          href={baseParams({ page: String(Math.max(1, currentPage - 1)) })}
                          aria-disabled={currentPage === 1}
                          className={`rounded px-3 py-1.5 ${
                            currentPage === 1
                              ? "pointer-events-none text-slate-600"
                              : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          Prev
                        </Link>
                        <span className="text-slate-500">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Link
                          href={baseParams({ page: String(Math.min(totalPages, currentPage + 1)) })}
                          aria-disabled={currentPage === totalPages}
                          className={`rounded px-3 py-1.5 ${
                            currentPage === totalPages
                              ? "pointer-events-none text-slate-600"
                              : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          Next
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeView === "stats" && (
                <SiemStatsTable
                  results={results}
                  groupBy={groupBy ?? "sourcetype"}
                  onChangeHref={(g) => baseParams({ groupBy: g })}
                />
              )}

              {activeView === "viz" && (
                <SiemTimeline timestamps={results.map((r) => r.timestamp)} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
