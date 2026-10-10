import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CourseCard } from "@/components/courses/CourseCard";
import { courses } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Our Programs | Trinetraa Cyber Academy",
  description:
    "Explore Trinetraa Cyber Academy's 6-month live SOC Analyst Training Program — hands-on access to real SOC tools and a real incident ticket queue.",
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
              A live, hands-on SOC Analyst training program built around real
              tools and a real incident ticket queue.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white pb-24">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course.slug} course={course} delay={i * 0.08} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
