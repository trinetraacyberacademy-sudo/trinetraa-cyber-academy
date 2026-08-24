import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const orderId = typeof body?.razorpay_order_id === "string" ? body.razorpay_order_id : null;
  const paymentId = typeof body?.razorpay_payment_id === "string" ? body.razorpay_payment_id : null;
  const signature = typeof body?.razorpay_signature === "string" ? body.razorpay_signature : null;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const registration = await prisma.registration.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!registration || registration.userId !== session.user.id) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  if (registration.status === "PAID") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payment verification unavailable." }, { status: 500 });
  }

  const isValid = validatePaymentVerification(
    { order_id: orderId, payment_id: paymentId },
    signature,
    keySecret,
  );

  if (!isValid) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  let amountPaid: number | null = null;
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    amountPaid = typeof payment.amount === "string" ? parseInt(payment.amount, 10) : payment.amount;
  } catch {
    // Fall back to nothing — the row still gets marked PAID from a verified
    // signature; amount can be backfilled from the webhook if this fetch fails.
  }

  await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: "PAID",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      amountPaid,
    },
  });

  return NextResponse.json({ success: true });
}
