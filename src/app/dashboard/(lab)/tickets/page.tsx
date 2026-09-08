import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";
import { SeverityBadge, TicketStatusBadge, CategoryBadge } from "@/components/lab/badges";
import { TicketFilters } from "@/components/lab/TicketFilters";
import type { TicketCategory, TicketSeverity, TicketStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TrinetraTicket | Trinetraa Cyber Academy",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    category?: string;
    severity?: string;
    sort?: string;
  }>;
}) {
  const user = await requirePaidStudent();
  const { status, category, severity, sort } = await searchParams;

  // First paid student to open the queue claims any unassigned training
  // tickets — this is a shared, fixed case set for now (see build notes).
  await prisma.ticket.updateMany({
    where: { assignedToUserId: null },
    data: { assignedToUserId: user.id },
  });

  const tickets = await prisma.ticket.findMany({
    where: {
      assignedToUserId: user.id,
      ...(status ? { status: status as TicketStatus } : {}),
      ...(category ? { category: category as TicketCategory } : {}),
      ...(severity ? { severity: severity as TicketSeverity } : {}),
    },
    orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">TrinetraTicket</h1>
          <p className="mt-1 text-sm text-slate-400">
            Your assigned case queue — investigate, document findings, and close each ticket.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6">
        <TicketFilters
          status={status}
          category={category}
          severity={severity}
          sort={sort}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-slate-500" />
            <p className="text-sm text-slate-400">No tickets match these filters.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] tracking-wide text-slate-500 uppercase">
                <th className="px-5 py-3 font-medium">Ticket</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Reported
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="block"
                    >
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
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-slate-400">
                    {ticket.createdAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
