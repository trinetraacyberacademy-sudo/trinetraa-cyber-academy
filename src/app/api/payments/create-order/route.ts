import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const courseSlug = typeof body?.courseSlug === "string" ? body.courseSlug : null;
  if (!courseSlug) {
    return NextResponse.json({ error: "Missing course selection." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.isActive) {
    return NextResponse.json(
      { error: "This course is not available right now." },
      { status: 404 },
    );
  }

  const existing = await prisma.registration.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing?.status === "PAID") {
    return NextResponse.json(
      { error: "You're already enrolled and paid for this course.", alreadyPaid: true },
      { status: 409 },
    );
  }

  const amountPaise = course.price * 100;

  let registrationId = existing?.id;

  // Create (or reuse) the Registration row first so we have a stable receipt id,
  // then create the Razorpay order, then stamp the order id onto the row.
  if (!registrationId) {
    const created = await prisma.registration.create({
      data: { userId: session.user.id, courseId: course.id, status: "PENDING_PAYMENT" },
    });
    registrationId = created.id;
  }

  let order;
  try {
    order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: registrationId,
      notes: {
        registrationId,
        userId: session.user.id,
        courseSlug: course.slug,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not start payment right now. Please try again." },
      { status: 502 },
    );
  }

  await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: "PENDING_PAYMENT",
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      amountPaid: null,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    course: { title: course.title, price: course.price },
    user: { name: session.user.name, email: session.user.email },
  });
}
