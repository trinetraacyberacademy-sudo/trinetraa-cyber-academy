import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Fingerprint, Mail, Paperclip, Link2, Search } from "lucide-react";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";
import { SeverityBadge, TicketStatusBadge, CategoryBadge } from "@/components/lab/badges";
import { TicketActions } from "@/components/lab/TicketActions";
import { AssignToMeButton } from "@/components/lab/AssignToMeButton";
import { EmailHeadersBlock } from "@/components/lab/EmailHeadersBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ticket | TrinetraTicket",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePaidStudent();
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      reportedEmail: { include: { toEmployee: true } },
      logEvents: { orderBy: { timestamp: "asc" }, include: { employee: true } },
      assignedToUser: { select: { id: true, name: true } },
    },
  });

  if (!ticket) {
    notFound();
  }

  const isMine = ticket.assignedToUserId === user.id;

  const emailDeliveryLog = ticket.reportedEmail
    ? ticket.logEvents.find(
        (log) =>
          log.sourceType === "EMAIL_GATEWAY" &&
          log.employeeId === ticket.reportedEmail?.toEmployeeId,
      )
    : undefined;

  return (
    <div>
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to queue
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-bold text-white">{ticket.title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">{ticket.description}</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 text-xs sm:grid-cols-4">
          <div>
            <p className="text-slate-500">Number</p>
            <p className="mt-1 font-mono text-signal-400">{ticket.ticketNumber}</p>
          </div>
          <div>
            <p className="text-slate-500">Category / Severity</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <CategoryBadge category={ticket.category} />
              <SeverityBadge severity={ticket.severity} />
            </div>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <div className="mt-1">
              <TicketStatusBadge status={ticket.status} />
            </div>
          </div>
          <div>
            <p className="text-slate-500">Assigned To</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-medium text-white">
                {ticket.assignedToUser ? (isMine ? "You" : ticket.assignedToUser.name) : "Unassigned"}
              </span>
              {!isMine && <AssignToMeButton ticketId={ticket.id} />}
            </div>
          </div>
          <div>
            <p className="text-slate-500">Opened</p>
            <p className="mt-1 text-slate-300">
              {ticket.createdAt.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {ticket.resolvedAt && (
            <div>
              <p className="text-slate-500">Resolved</p>
              <p className="mt-1 text-slate-300">
                {ticket.resolvedAt.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {ticket.reportedEmail && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-semibold text-white">Reported Email</p>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm">
                <div className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1.5 text-xs">
                  <span className="text-slate-500">From</span>
                  <span className="font-mono text-red-300">
                    {ticket.reportedEmail.fromAddress}
                  </span>
                  <span className="text-slate-500">To</span>
                  <span className="font-mono text-slate-300">
                    {ticket.reportedEmail.toEmployee?.name ?? "Unknown"} &lt;
                    {ticket.reportedEmail.toEmployee?.email}&gt;
                  </span>
                  <span className="text-slate-500">Subject</span>
                  <span className="font-medium text-white">{ticket.reportedEmail.subject}</span>
                  {emailDeliveryLog && (
                    <>
                      <span className="text-slate-500">Date</span>
                      <span className="text-slate-300">
                        {emailDeliveryLog.timestamp.toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  )}
                </div>

                {ticket.reportedEmail.rawHeaders && (
                  <EmailHeadersBlock rawHeaders={ticket.reportedEmail.rawHeaders} />
                )}

                <div className="rounded-lg border border-white/10 bg-ink-950 p-4 whitespace-pre-wrap text-slate-300">
                  {ticket.reportedEmail.body}
                </div>

                {ticket.reportedEmail.linkUrl && (
                  <div className="flex items-center gap-2 rounded-lg border border-flare-500/20 bg-flare-500/5 px-3 py-2 text-xs text-flare-300">
                    <Link2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono break-all">{ticket.reportedEmail.linkUrl}</span>
                  </div>
                )}
                {ticket.reportedEmail.attachmentName && (
                  <div className="flex items-center gap-2 rounded-lg border border-flare-500/20 bg-flare-500/5 px-3 py-2 text-xs text-flare-300">
                    <Paperclip className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono">{ticket.reportedEmail.attachmentName}</span>
                  </div>
                )}
                {ticket.reportedEmail.attachmentHash && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    <Fingerprint className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="font-mono break-all">
                      {ticket.reportedEmail.attachmentHash}
                    </span>
                    <Link
                      href={`/dashboard/siem?q=${encodeURIComponent(
                        `hash=${ticket.reportedEmail.attachmentHash}`,
                      )}`}
                      className="ml-auto shrink-0 font-sans font-medium text-signal-400 hover:text-signal-300"
                    >
                      Search hash
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-3">
              <p className="text-sm font-semibold text-white">
                Correlated Log Events ({ticket.logEvents.length})
              </p>
              <Link
                href={`/dashboard/siem?q=${encodeURIComponent(`ticket=${ticket.ticketNumber}`)}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-400 hover:text-signal-300"
              >
                <Search className="h-3 w-3" />
                Search in TrinetraSIEM
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {ticket.logEvents.map((log) => (
                <div key={log.id} className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="rounded border border-white/10 px-1.5 py-0.5 font-medium text-slate-400">
                      {log.sourceType.replace("_", " ")}
                    </span>
                    <span>
                      {log.timestamp.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {log.employee && <span>{log.employee.name}</span>}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-300">{log.eventSummary}</p>
                  <pre className="mt-2 overflow-x-auto rounded-md bg-ink-950 p-3 font-mono text-[11px] leading-5 text-emerald-300/90">
                    {log.rawLogLine}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isMine ? (
          <TicketActions
            ticketId={ticket.id}
            status={ticket.status}
            investigationNotes={ticket.investigationNotes}
            resolution={ticket.resolution}
            resolutionNotes={ticket.resolutionNotes}
          />
        ) : (
          <div className="flex h-fit flex-col items-start gap-3 rounded-xl border border-white/10 bg-ink-900/60 p-5">
            <p className="text-sm font-semibold text-white">
              {ticket.assignedToUser ? `Assigned to ${ticket.assignedToUser.name}` : "Unassigned"}
            </p>
            <p className="text-xs text-slate-400">
              Assign this ticket to yourself to add investigation notes, escalate, or close it.
            </p>
            <AssignToMeButton ticketId={ticket.id} />
          </div>
        )}
      </div>
    </div>
  );
}
