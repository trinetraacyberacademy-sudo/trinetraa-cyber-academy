import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, Mail, Phone, User as UserIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Trinetraa Cyber Academy",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const { payment } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      registrations: {
        include: { course: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <section className="bg-slate-50 py-32">
      <Container className="max-w-3xl">
        <Reveal>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Here&apos;s where things stand with your registration.
          </p>
        </Reveal>

        {payment === "success" && (
          <Reveal delay={0.05}>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Payment successful! Your seat is confirmed.
            </div>
          </Reveal>
        )}

        <div className="mt-8 space-y-6">
          {user.registrations.length === 0 ? (
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                <p className="text-sm text-slate-600">
                  You don&apos;t have an active registration yet.
                </p>
                <a
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-signal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-signal-600/20 hover:bg-signal-700"
                >
                  Browse Programs
                </a>
              </div>
            </Reveal>
          ) : (
            user.registrations.map((registration, i) => (
              <Reveal key={registration.id} delay={i * 0.08}>
                <RegistrationCard
                  registration={registration}
                  userName={user.name}
                  userEmail={user.email}
                  userPhone={user.phone}
                />
              </Reveal>
            ))
          )}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Your Profile
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <UserIcon className="h-4 w-4 text-signal-600" />
                {user.name}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-signal-600" />
                {user.email}
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-signal-600" />
                {user.phone}
              </div>
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
