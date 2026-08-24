import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { courses } from "@/lib/site-data";

type Course = (typeof courses)[number];

export function CourseCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const featured = course.type === "program";

  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          featured ? "border-signal-200 lg:col-span-2" : "border-slate-200"
        }`}
      >
        {featured && (
          <div className="h-1.5 w-full bg-gradient-to-r from-signal-500 via-signal-600 to-flare-500" />
        )}

        <div className={`flex flex-1 flex-col p-7 sm:p-8 ${featured ? "lg:flex-row lg:gap-10" : ""}`}>
          <div className="flex-1">
            <Badge tone={course.badgeTone}>{course.badgeText}</Badge>

            <h3 className="mt-4 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              {course.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{course.tagline}</p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              <CalendarClock className="h-3.5 w-3.5 text-signal-600" />
              {course.format}
            </div>

            <ul className="mt-6 space-y-2.5">
              {course.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500 italic">
              {course.audience}
            </p>
          </div>

          <div
            className={`mt-7 flex flex-col ${
              featured ? "lg:mt-0 lg:w-64 lg:shrink-0 lg:justify-between" : ""
            }`}
          >
            <div className={featured ? "lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-slate-50 lg:p-6" : ""}>
              <div className="flex items-end gap-2.5">
                <span className="font-display text-3xl font-bold text-slate-900">
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
                {course.originalPrice && (
                  <span className="mb-1 text-sm font-medium text-slate-400 line-through decoration-flare-500/70">
                    ₹{course.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <Button
                href={course.href}
                size="md"
                className="mt-4 w-full"
                icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
