"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateEnquiryStatusAction } from "@/lib/actions/admin";
import type { EnquiryStatus } from "@/generated/prisma/client";

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  createdAt: Date;
};

const statusOptions: EnquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];

function StatusSelect({ row }: { row: Row }) {
  const [status, setStatus] = useState(row.status);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as EnquiryStatus;
          setStatus(next);
          startTransition(async () => {
            await updateEnquiryStatusAction(row.id, next);
          });
        }}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-500/20"
      >
        {statusOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
    </div>
  );
}

function MessageCell({ message }: { message: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className={`text-left text-xs text-slate-600 hover:text-signal-700 ${
        expanded ? "" : "max-w-[220px] truncate"
      }`}
      title={message}
    >
      {message}
    </button>
  );
}

export function EnquiriesTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        No enquiries yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Contact</th>
            <th className="px-5 py-3">Message</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-5 py-4 font-medium text-slate-900">{row.name}</td>
              <td className="px-5 py-4">
                <p className="text-xs text-slate-500">{row.email}</p>
                <p className="text-xs text-slate-500">{row.phone}</p>
              </td>
              <td className="px-5 py-4">
                <MessageCell message={row.message} />
              </td>
              <td className="px-5 py-4">
                <StatusSelect row={row} />
              </td>
              <td className="px-5 py-4 text-xs text-slate-500">
                {new Date(row.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
