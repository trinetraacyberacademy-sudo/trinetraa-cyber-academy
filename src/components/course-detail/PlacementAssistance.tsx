import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { placementAssistance } from "@/lib/site-data";

export function PlacementAssistance() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <SectionHeading
          eyebrow="Placement Assistance"
          title="Support as you start applying"
          description="A supporting feature available to trainees after course completion — not a job guarantee."
        />

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            {placementAssistance.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-signal-600" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
