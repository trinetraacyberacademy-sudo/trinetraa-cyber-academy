import { NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const isValid = validateWebhookSignature(rawBody, signature, secret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event?.event as string | undefined;

  try {
    if (eventType === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      const orderId: string | undefined = payment?.order_id;
      if (orderId) {
        const registration = await prisma.registration.findUnique({
          where: { razorpayOrderId: orderId },
        });
        if (registration && registration.status !== "PAID") {
          await prisma.registration.update({
            where: { id: registration.id },
            data: {
              status: "PAID",
              razorpayPaymentId: payment.id,
              amountPaid: payment.amount,
            },
          });
        }
      }
    } else if (eventType === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      const orderId: string | undefined = payment?.order_id;
      if (orderId) {
        const registration = await prisma.registration.findUnique({
          where: { razorpayOrderId: orderId },
        });
        if (registration && registration.status !== "PAID") {
          await prisma.registration.update({
            where: { id: registration.id },
            data: { status: "FAILED" },
          });
        }
      }
    }
  } catch (err) {
    console.error("Razorpay webhook processing error:", err);
    // Still acknowledge receipt — Razorpay retries on non-2xx, which won't fix
    // a data-layer issue here, and we've already verified the signature.
  }

  return NextResponse.json({ received: true });
}
