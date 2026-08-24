import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CourseFilterTabs } from "@/components/courses/CourseFilterTabs";
import { WorkshopSection } from "@/components/home/WorkshopSection";

export const metadata: Metadata = {
  title: "Our Programs | Trinetraa Cyber Academy",
  description:
    "Explore Trinetraa Cyber Academy's SOC training programs — from the 6-month live SOC Analyst Training + Internship Program to the 3-day live SOC workshop.",
};

export default function CoursesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-grid mask-fade-b absolute inset-0" />
        </div>
        <Container className="relative text-center">
          <Reveal>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Our Programs
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Whether you want a quick, hands-on taste of SOC work or a full job-ready
              transformation, start here.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white pb-24">
        <Container>
          <CourseFilterTabs />

          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">New to cybersecurity?</span>{" "}
                Start with the{" "}
                <Link href="#workshop" className="font-semibold text-signal-700 hover:underline">
                  3-Day Workshop
                </Link>
                .{" "}
                <span className="font-semibold text-slate-900">Ready to go all-in?</span>{" "}
                Join the{" "}
                <Link
                  href="/courses/soc-analyst-program"
                  className="font-semibold text-signal-700 hover:underline"
                >
                  6-Month Program
                </Link>
                .
              </p>
              <Link
                href="/courses/soc-analyst-program"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-signal-700"
              >
                Compare details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <WorkshopSection />
    </>
  );
}
