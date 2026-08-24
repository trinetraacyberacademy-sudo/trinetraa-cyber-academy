import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { interviewStatements } from "@/lib/site-data";

export function InterviewReady() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-ink-950 p-8 sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-signal-500/30 bg-signal-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-signal-400 uppercase">
              After This Program
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              What you can say in an interview after this
            </h2>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {interviewStatements.map((statement, i) => (
                <Reveal key={statement} delay={i * 0.06}>
                  <li className="flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-signal-400" />
                    &ldquo;{statement}&rdquo;
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
