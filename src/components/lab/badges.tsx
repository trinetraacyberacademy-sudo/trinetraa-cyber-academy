import type { TicketCategory, TicketSeverity, TicketStatus } from "@/generated/prisma/client";

const severityStyles: Record<TicketSeverity, string> = {
  LOW: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  MEDIUM: "bg-signal-500/15 text-signal-300 border-signal-500/30",
  HIGH: "bg-flare-500/15 text-flare-300 border-flare-500/30",
  CRITICAL: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function SeverityBadge({ severity }: { severity: TicketSeverity }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  );
}

const statusStyles: Record<TicketStatus, string> = {
  OPEN: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  IN_PROGRESS: "bg-signal-500/15 text-signal-300 border-signal-500/30",
  RESOLVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ESCALATED: "bg-flare-500/15 text-flare-300 border-flare-500/30",
};

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  ESCALATED: "Escalated",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

const categoryLabels: Record<TicketCategory, string> = {
  PHISHING: "Phishing",
  MALWARE: "Malware",
  ENDPOINT: "Endpoint",
  IDENTITY: "Identity",
  NETWORK: "Network",
};

export function CategoryBadge({ category }: { category: TicketCategory }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
      {categoryLabels[category]}
    </span>
  );
}
