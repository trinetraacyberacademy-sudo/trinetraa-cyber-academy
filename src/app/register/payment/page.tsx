import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Payment | Trinetraa Cyber Academy",
};

const includesByType: Record<string, string[]> = {
  "soc-analyst-program": [
    "6-month live instructor-led training",
    "Hands-on Splunk, Falcon, Azure/Entra ID & Mimecast access",
    "Real incident ticket queue across 50+ categories",
    "Course completion certificate",
  ],
  workshop: [
    "3 live instructor-led online sessions",
    "Live demo of real alert triage inside SOC tools",
    "Certificate of Participation",
    "Live Q&A with working SOC mentors",
  ],
};

export default async function RegisterPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const { course: courseSlug } = await searchParams;
  if (!courseSlug) {
    redirect("/courses");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.isActive) {
    redirect("/courses");
  }

  const existing = await prisma.registration.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing?.status === "PAID") {
    redirect("/dashboard");
  }

  const includes = includesByType[course.slug] ?? [];

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
      </div>
      <Container className="relative max-w-xl">
        <Reveal>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Almost there, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Complete your payment to confirm your seat.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="h-1.5 w-full bg-gradient-to-r from-signal-500 via-signal-600 to-flare-500" />
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                {course.title}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="font-display text-4xl font-bold text-slate-900">
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
                {course.originalPrice && (
                  <span className="mb-1.5 text-base font-medium text-slate-400 line-through">
                    ₹{course.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                <CalendarClock className="h-3.5 w-3.5 text-signal-600" />
                {course.format}
              </div>

              {includes.length > 0 && (
                <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 border-t border-slate-100 pt-6">
                <RazorpayCheckout
                  courseSlug={course.slug}
                  courseTitle={course.title}
                  price={course.price}
                  userName={user.name}
                  userEmail={user.email}
                  userPhone={user.phone}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
