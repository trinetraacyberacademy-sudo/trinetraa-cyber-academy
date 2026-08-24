import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { IndianRupee, MailQuestion, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StatCard } from "@/components/admin/StatCard";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Trinetraa Cyber Academy",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [registrations, enquiries, totalRegistrations, paidCount, revenue, newEnquiriesCount] =
    await Promise.all([
      prisma.registration.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          course: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "PAID" } }),
      prisma.registration.aggregate({
        where: { status: "PAID" },
        _sum: { amountPaid: true },
      }),
      prisma.enquiry.count({ where: { status: "NEW" } }),
    ]);

  const totalRevenue = (revenue._sum.amountPaid ?? 0) / 100;

  return (
    <section className="bg-slate-50 py-32">
      <Container className="max-w-6xl">
        <Reveal>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage registrations and enquiries day to day.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <StatCard icon={Users} label="Total Registrations" value={totalRegistrations} />
            <StatCard icon={ShieldCheck} label="Total Paid Students" value={paidCount} />
            <StatCard
              icon={IndianRupee}
              label="Total Revenue Collected"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            />
            <StatCard icon={MailQuestion} label="New Enquiries" value={newEnquiriesCount} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Registrations
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Payment status is synced automatically from Razorpay — read-only here.
            </p>
            <div className="mt-4">
              <RegistrationsTable rows={registrations} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12">
            <h2 className="font-display text-lg font-semibold text-slate-900">Enquiries</h2>
            <div className="mt-4">
              <EnquiriesTable rows={enquiries} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
