import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/lib/site-data";

export function ProgramTimeline() {
  return (
    <section id="curriculum" className="bg-slate-50 py-24">
      <Container>
        <SectionHeading
          eyebrow="Program Path"
          title="Six months, three phases, one structured path"
          description="Every phase builds directly on the last — from fundamentals to a live incident queue to escalation and career readiness."
        />

        <div className="relative mt-16 lg:mt-20">
          <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-signal-400 via-slate-300 to-transparent lg:left-1/2 lg:-translate-x-1/2" />

          <div className="space-y-10 lg:space-y-0">
            {timeline.map((item, i) => (
              <div
                key={item.phase}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-x-16 ${
                  i !== timeline.length - 1 ? "lg:pb-16" : ""
                }`}
              >
                <div
                  className={`hidden lg:block ${i % 2 === 0 ? "" : "lg:col-start-2"}`}
                />
                <Reveal
                  className={i % 2 === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2 lg:row-start-1"}
                  delay={i * 0.1}
                >
                  <div
                    className={`relative pl-14 lg:pl-0 ${
                      i % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"
                    }`}
                  >
                    <span className="absolute top-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-signal-500 bg-white font-display text-xs font-bold text-signal-700 lg:static lg:mb-4 lg:inline-flex">
                      0{i + 1}
                    </span>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <span className="text-xs font-semibold tracking-widest text-flare-600 uppercase">
                        {item.phase}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 flex max-w-xl items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-600 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-600" />
            Career guidance (resume support, mock interviews) is available during Phase 3.
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
