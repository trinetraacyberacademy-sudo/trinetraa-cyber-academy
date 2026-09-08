"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Save, ShieldAlert } from "lucide-react";
import { saveInvestigationNotes, escalateTicket, closeTicket } from "@/app/dashboard/(lab)/tickets/actions";
import type { TicketStatus } from "@/generated/prisma/client";

const resolutionOptions = [
  "Confirmed Malicious – Remediated",
  "Confirmed Malicious – Escalated to IR",
  "False Positive",
  "Duplicate / No Action Needed",
];

export function TicketActions({
  ticketId,
  status,
  investigationNotes,
  resolution,
  resolutionNotes,
}: {
  ticketId: string;
  status: TicketStatus;
  investigationNotes: string | null;
  resolution: string | null;
  resolutionNotes: string | null;
}) {
  const [notes, setNotes] = useState(investigationNotes ?? "");
  const [selectedResolution, setSelectedResolution] = useState(resolution ?? "");
  const [closingNotes, setClosingNotes] = useState(resolutionNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const closed = status === "RESOLVED";

  function handleSaveNotes() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      await saveInvestigationNotes(ticketId, notes);
      setSaved(true);
    });
  }

  function handleEscalate() {
    setError(null);
    startTransition(async () => {
      await escalateTicket(ticketId, notes);
    });
  }

  function handleClose() {
    setError(null);
    if (!selectedResolution) {
      setError("Choose a resolution before closing the ticket.");
      return;
    }
    startTransition(async () => {
      try {
        await closeTicket(ticketId, selectedResolution, closingNotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-ink-900/60 p-5">
        <p className="text-sm font-semibold text-white">Investigation Notes</p>
        <p className="mt-1 text-xs text-slate-500">
          Document what you find as you correlate the reported email against the logs.
        </p>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          disabled={closed}
          rows={8}
          placeholder="e.g. Sender domain fails SPF/DKIM. Authentication log shows a successful login from an unrecognized IP 8 minutes after email delivery..."
          className="mt-3 w-full rounded-lg border border-white/10 bg-ink-950 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-signal-500 focus:outline-none disabled:opacity-60"
        />
        {!closed && (
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-signal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-signal-500 disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" />
              Save Notes
            </button>
            {saved && <span className="text-xs text-emerald-400">Saved.</span>}
          </div>
        )}
      </div>

      {!closed && (
        <div className="rounded-xl border border-flare-500/20 bg-flare-500/5 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-flare-300">
            <ShieldAlert className="h-4 w-4" />
            Escalate
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Send this to L2/L3 without closing it — use this when it&apos;s beyond what you can
            resolve directly.
          </p>
          <button
            type="button"
            onClick={handleEscalate}
            disabled={isPending}
            className="mt-3 rounded-lg border border-flare-500/30 px-4 py-2 text-xs font-semibold text-flare-300 hover:bg-flare-500/10 disabled:opacity-60"
          >
            Escalate Ticket
          </button>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-ink-900/60 p-5">
        <p className="text-sm font-semibold text-white">Resolution</p>

        {closed ? (
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {resolution}
            </p>
            {resolutionNotes && (
              <p className="rounded-lg border border-white/10 bg-ink-950 p-3 text-xs whitespace-pre-wrap text-slate-300">
                {resolutionNotes}
              </p>
            )}
          </div>
        ) : (
          <>
            <select
              value={selectedResolution}
              onChange={(e) => setSelectedResolution(e.target.value)}
              className="mt-3 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-200 focus:border-signal-500 focus:outline-none"
            >
              <option value="">Select a resolution…</option>
              {resolutionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <textarea
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              rows={3}
              placeholder="Summarize why you're closing this ticket this way..."
              className="mt-3 w-full rounded-lg border border-white/10 bg-ink-950 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-signal-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Close Ticket
            </button>
          </>
        )}
      </div>
    </div>
  );
}
