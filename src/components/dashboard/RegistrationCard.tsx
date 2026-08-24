import { Receipt, ShieldCheck, XCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import { waLink } from "@/lib/site-data";
import type { RegistrationStatus } from "@/generated/prisma/client";

type Registration = {
  id: string;
  status: RegistrationStatus;
  amountPaid: number | null;
  razorpayPaymentId: string | null;
  updatedAt: Date;
  course: {
    slug: string;
    title: string;
    price: number;
    format: string;
  };
};

export function RegistrationCard({
  registration,
  userName,
  userEmail,
  userPhone,
}: {
  registration: Registration;
  userName: string;
  userEmail: string;
  userPhone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-slate-900">
            {registration.course.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{registration.course.format}</p>
        </div>
        <StatusBadge status={registration.status} />
      </div>

      {registration.status === "PAID" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 text-sm text-slate-700">
            <p className="flex items-center gap-2 font-semibold text-green-800">
              <Receipt className="h-4 w-4" />
              Payment receipt
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <dt className="text-slate-500">Amount paid</dt>
              <dd className="text-right font-medium text-slate-900">
                ₹{((registration.amountPaid ?? 0) / 100).toLocaleString("en-IN")}
              </dd>
              <dt className="text-slate-500">Payment ID</dt>
              <dd className="text-right font-mono text-[11px] font-medium text-slate-900">
                {registration.razorpayPaymentId ?? "—"}
              </dd>
              <dt className="text-slate-500">Date</dt>
              <dd className="text-right font-medium text-slate-900">
                {new Date(registration.updatedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </dd>
            </dl>
          </div>

          <div className="rounded-xl border border-signal-200 bg-signal-50/60 p-5 text-sm text-slate-700">
            <p className="flex items-center gap-2 font-semibold text-signal-800">
              <ShieldCheck className="h-4 w-4" />
              You&apos;re confirmed!
            </p>
            <p className="mt-2 leading-6">
              Your training environment is being prepared — access details for Splunk,
              CrowdStrike Falcon, and the rest of the toolset are coming soon.
            </p>
          </div>
        </div>
      )}

      {(registration.status === "PENDING_PAYMENT" || registration.status === "FAILED") && (
        <div className="mt-6 rounded-xl border border-flare-200 bg-flare-50/60 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-flare-800">
            {registration.status === "FAILED" ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Receipt className="h-4 w-4" />
            )}
            {registration.status === "FAILED"
              ? "Your last payment attempt failed"
              : "Complete your enrollment"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            No amount has been charged yet. Finish payment below to confirm your seat.
          </p>
          <div className="mt-4">
            <RazorpayCheckout
              courseSlug={registration.course.slug}
              courseTitle={registration.course.title}
              price={registration.course.price}
              userName={userName}
              userEmail={userEmail}
              userPhone={userPhone}
            />
          </div>
        </div>
      )}

      {registration.status === "REFUNDED" && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">This registration was refunded.</p>
          <p className="mt-2 leading-6 text-slate-500">
            Message us on{" "}
            <a
              href={waLink(
                `Hi, I have a question about my refund for ${registration.course.title}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-signal-700 hover:underline"
            >
              WhatsApp
            </a>{" "}
            if you have any questions about this refund.
          </p>
        </div>
      )}
    </div>
  );
}
