import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { RegistrationStatus } from "@/generated/prisma/client";

type Row = {
  id: string;
  status: RegistrationStatus;
  amountPaid: number | null;
  razorpayPaymentId: string | null;
  createdAt: Date;
  user: { name: string; email: string; phone: string };
  course: { title: string };
};

export function RegistrationsTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        No registrations yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[920px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <th className="px-5 py-3">Student</th>
            <th className="px-5 py-3">Course</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Amount Paid</th>
            <th className="px-5 py-3">Razorpay Payment ID</th>
            <th className="px-5 py-3">Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900">{row.user.name}</p>
                <p className="text-xs text-slate-500">{row.user.email}</p>
                <p className="text-xs text-slate-500">{row.user.phone}</p>
              </td>
              <td className="px-5 py-4 text-slate-700">{row.course.title}</td>
              <td className="px-5 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-5 py-4 text-slate-700">
                {row.amountPaid ? `₹${(row.amountPaid / 100).toLocaleString("en-IN")}` : "—"}
              </td>
              <td className="px-5 py-4 font-mono text-xs text-slate-500">
                {row.razorpayPaymentId ?? "—"}
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
