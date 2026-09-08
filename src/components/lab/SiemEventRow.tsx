"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Ticket as TicketIcon } from "lucide-react";
import { extractFields } from "@/lib/log-field-extract";

type Props = {
  sourceLabel: string;
  timestampLabel: string;
  employeeLabel: string | null;
  eventSummary: string;
  rawLogLine: string;
  relatedTicket: { id: string; ticketNumber: string } | null;
};

export function SiemEventRow({
  sourceLabel,
  timestampLabel,
  employeeLabel,
  eventSummary,
  rawLogLine,
  relatedTicket,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const fields = expanded ? extractFields(rawLogLine) : [];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900/60">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-2.5 text-left"
      >
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
          <span className="rounded border border-white/10 px-1.5 py-0.5 font-medium text-slate-400">
            {sourceLabel}
          </span>
          <span className="text-slate-500">{timestampLabel}</span>
          {employeeLabel && <span className="text-slate-500">{employeeLabel}</span>}
        </div>
        {relatedTicket && (
          <Link
            href={`/dashboard/tickets/${relatedTicket.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-400 hover:text-signal-300"
          >
            <TicketIcon className="h-3 w-3" />
            {relatedTicket.ticketNumber}
          </Link>
        )}
      </button>
      <div className="px-5 py-3">
        <p className="text-sm text-slate-300">{eventSummary}</p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-ink-950 p-3 font-mono text-[11px] leading-5 text-emerald-300/90">
          {rawLogLine}
        </pre>
        {expanded && fields.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-md border border-white/10">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-500">
                  <th className="px-3 py-1.5 font-medium">Field</th>
                  <th className="px-3 py-1.5 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fields.map((f, i) => (
                  <tr key={`${f.key}-${i}`}>
                    <td className="px-3 py-1.5 font-mono text-signal-300">{f.key}</td>
                    <td className="px-3 py-1.5 font-mono break-all text-slate-300">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
