import type { RegistrationStatus } from "@/generated/prisma/client";

const statusConfig: Record<RegistrationStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: {
    label: "Payment Pending",
    className: "bg-flare-50 text-flare-700 border-flare-200",
  },
  PAID: {
    label: "Paid",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  FAILED: {
    label: "Payment Failed",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export function StatusBadge({ status }: { status: RegistrationStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
