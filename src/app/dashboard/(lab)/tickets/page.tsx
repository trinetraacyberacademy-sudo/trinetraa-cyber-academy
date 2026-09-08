import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";
import { SeverityBadge, TicketStatusBadge, CategoryBadge } from "@/components/lab/badges";
import { TicketFilters } from "@/components/lab/TicketFilters";
import { AssignToMeButton } from "@/components/lab/AssignToMeButton";
import type { TicketCategory, TicketSeverity, TicketStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TrinetraTicket | Trinetraa Cyber Academy",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    status?: string;
    category?: string;
    severity?: string;
    sort?: string;
  }>;
}) {
  const user = await requirePaidStudent();
  const { view, status, category, severity, sort } = await searchParams;
  const viewAll = view === "all";

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(viewAll ? {} : { assignedToUserId: user.id }),
      ...(status ? { status: status as TicketStatus } : {}),
      ...(category ? { category: category as TicketCategory } : {}),
      ...(severity ? { severity: severity as TicketSeverity } : {}),
    },
    include: { assignedToUser: { select: { id: true, name: true } } },
    orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
  });

  const queryString = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { view, status, category, severity, sort, ...overrides };
    for (const [key, val] of Object.entries(merged)) {
      if (val) params.set(key, val);
    }
    return params.toString();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">TrinetraTicket</h1>
          <p className="mt-1 text-sm text-slate-400">
            Case queue — assign tickets to yourself, investigate, document findings, and close.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1 border-b border-white/10">
        <Link
          href={`/dashboard/tickets?${queryString({ view: undefined })}`}
          className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
            !viewAll
              ? "border-signal-500 text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          My Tickets
        </Link>
        <Link
          href={`/dashboard/tickets?${queryString({ view: "all" })}`}
          className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
            viewAll
              ? "border-signal-500 text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          All Tickets
        </Link>
      </div>

      <div className="mt-4">
        <TicketFilters status={status} category={category} severity={severity} sort={sort} />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-slate-500" />
            <p className="text-sm text-slate-400">
              {viewAll ? "No tickets match these filters." : "No tickets assigned to you yet — check All Tickets."}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] tracking-wide text-slate-500 uppercase">
                <th className="px-5 py-3 font-medium">Ticket</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                {viewAll && <th className="px-5 py-3 font-medium">Assigned To</th>}
                <th className="px-5 py-3 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Reported
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                {viewAll && <th className="px-5 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/tickets/${ticket.id}`} className="block">
                      <span className="font-mono text-xs text-signal-400">
                        {ticket.ticketNumber}
                      </span>
                      <p className="mt-0.5 font-semibold text-white hover:text-signal-300">
                        {ticket.title}
                      </p>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <CategoryBadge category={ticket.category} />
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge severity={ticket.severity} />
                  </td>
                  <td className="px-5 py-4">
                    <TicketStatusBadge status={ticket.status} />
                  </td>
                  {viewAll && (
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {ticket.assignedToUser
                        ? ticket.assignedToUser.id === user.id
                          ? "You"
                          : ticket.assignedToUser.name
                        : "Unassigned"}
                    </td>
                  )}
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-slate-400">
                    {ticket.createdAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {viewAll && (
                    <td className="px-5 py-4 text-right">
                      {ticket.assignedToUser?.id !== user.id && (
                        <AssignToMeButton ticketId={ticket.id} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
