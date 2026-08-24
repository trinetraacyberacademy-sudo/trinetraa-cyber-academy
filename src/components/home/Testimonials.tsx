import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/site-data";

export function Testimonials() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Trainee Voices"
          title="What trainees say after month six"
          description="Hear directly from analysts who trained with us and made the jump into real SOC roles."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                <Quote className="h-7 w-7 text-signal-200" />
                <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-600 font-display text-sm font-semibold text-white">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
