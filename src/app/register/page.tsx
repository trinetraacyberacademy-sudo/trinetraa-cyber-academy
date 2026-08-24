import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register | Trinetraa Cyber Academy",
  description: "Register for a Trinetraa Cyber Academy program.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;

  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      title: true,
      price: true,
      originalPrice: true,
      format: true,
    },
  });

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
      </div>
      <Container className="relative max-w-xl">
        <Reveal>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Register
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Fill in your details and pick a program. You&apos;ll get clear next steps for
              payment right after.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
            <RegisterForm courses={courses} defaultCourseSlug={course} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
