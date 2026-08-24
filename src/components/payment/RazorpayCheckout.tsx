"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, RotateCcw, ShieldCheck } from "lucide-react";

type Status = "idle" | "processing" | "verifying" | "error" | "cancelled";

export function RazorpayCheckout({
  courseSlug,
  courseTitle,
  price,
  userName,
  userEmail,
  userPhone,
}: {
  courseSlug: string;
  courseTitle: string;
  price: number;
  userName: string;
  userEmail: string;
  userPhone: string;
}) {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setError(null);
    setStatus("processing");

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error ?? "Could not start payment. Please try again.");
        setStatus("error");
        return;
      }

      if (!window.Razorpay) {
        setError("Payment gateway is still loading — please try again in a moment.");
        setStatus("error");
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Trinetraa Cyber Academy",
        description: orderData.course.title,
        order_id: orderData.orderId,
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: { color: "#0e7490" },
        handler: async (response) => {
          setStatus("verifying");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              setError(verifyData.error ?? "We couldn't verify your payment. Please try again.");
              setStatus("error");
              return;
            }

            router.push("/dashboard?payment=success");
            router.refresh();
          } catch {
            setError("We couldn't verify your payment. Please try again.");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus((current) => (current === "verifying" ? current : "cancelled"));
          },
        },
      });

      rzp.on("payment.failed", (response) => {
        setError(
          response.error?.description ?? "Payment failed. Please try again.",
        );
        setStatus("error");
      });

      rzp.open();
    } catch {
      setError("Something went wrong starting your payment. Please try again.");
      setStatus("error");
    }
  }

  const isBusy = status === "processing" || status === "verifying";

  return (
    <div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      {status === "error" && error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {status === "cancelled" && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-flare-200 bg-flare-50 px-4 py-3 text-sm text-flare-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Payment cancelled. No amount was charged — you can try again anytime.
        </div>
      )}

      <button
        type="button"
        onClick={startPayment}
        disabled={isBusy || !scriptReady}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-signal-600/20 transition-all duration-200 hover:bg-signal-700 hover:shadow-lg hover:shadow-signal-600/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isBusy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {status === "verifying" ? "Verifying payment..." : "Opening secure checkout..."}
          </>
        ) : status === "error" || status === "cancelled" ? (
          <>
            <RotateCcw className="h-4 w-4" />
            Try Again — Pay ₹{price.toLocaleString("en-IN")}
          </>
        ) : !scriptReady ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading payment gateway...
          </>
        ) : (
          <>Pay ₹{price.toLocaleString("en-IN")} Now</>
        )}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-signal-600" />
        Secured by Razorpay &middot; {courseTitle}
      </p>
    </div>
  );
}
