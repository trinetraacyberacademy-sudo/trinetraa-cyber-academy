import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, Ticket as TicketIcon } from "lucide-react";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";
import { SiemSearchBar } from "@/components/lab/SiemSearchBar";
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

function matchingSourceTypes(query: string): LogSourceType[] {
  const q = query.toLowerCase();
  return (Object.keys(sourceLabels) as LogSourceType[]).filter(
    (key) => key.toLowerCase().includes(q.replace(/\s+/g, "_")) || sourceLabels[key].toLowerCase().includes(q),
  );
}

export default async function SiemPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePaidStudent();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let results: Prisma.LogEventGetPayload<{
    include: { employee: true; relatedTicket: true };
  }>[] = [];

  if (query) {
    const sourceMatches = matchingSourceTypes(query);

    results = await prisma.logEvent.findMany({
      where: {
        OR: [
          { eventSummary: { contains: query, mode: "insensitive" } },
          { rawLogLine: { contains: query, mode: "insensitive" } },
          { employee: { name: { contains: query, mode: "insensitive" } } },
          { employee: { email: { contains: query, mode: "insensitive" } } },
          ...(sourceMatches.length > 0 ? [{ sourceType: { in: sourceMatches } }] : []),
        ],
      },
      orderBy: { timestamp: "desc" },
      include: { employee: true, relatedTicket: true },
      take: 100,
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">TrinetraSIEM</h1>
      <p className="mt-1 text-sm text-slate-400">
        Search log events by keyword — try an employee name, email, source type, or a term
        from a ticket.
      </p>

      <div className="mt-6">
        <SiemSearchBar initialQuery={query} />
      </div>

      <div className="mt-4">
        {!query ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-6 py-16 text-center">
            <SearchIcon className="h-6 w-6 text-slate-500" />
            <p className="text-sm text-slate-400">Enter a search term to query the log index.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-ink-900/60 px-6 py-16 text-center">
            <p className="text-sm text-slate-400">
              No log events matched &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {results.map((log) => (
              <div
                key={log.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-ink-900/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded border border-white/10 px-1.5 py-0.5 font-medium text-slate-400">
                      {sourceLabels[log.sourceType]}
                    </span>
                    <span className="text-slate-500">
                      {log.timestamp.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {log.employee && (
                      <span className="text-slate-500">
                        {log.employee.name} &middot; {log.employee.department}
                      </span>
                    )}
                  </div>
                  {log.relatedTicket && (
                    <Link
                      href={`/dashboard/tickets/${log.relatedTicket.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-400 hover:text-signal-300"
                    >
                      <TicketIcon className="h-3 w-3" />
                      {log.relatedTicket.ticketNumber}
                    </Link>
                  )}
                </div>
                <div className="px-5 py-3">
                  <p className="text-sm text-slate-300">{log.eventSummary}</p>
                  <pre className="mt-2 overflow-x-auto rounded-md bg-ink-950 p-3 font-mono text-[11px] leading-5 text-emerald-300/90">
                    {log.rawLogLine}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
