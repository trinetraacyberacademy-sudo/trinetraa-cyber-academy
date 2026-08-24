import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { incidentCategories } from "@/lib/site-data";

export function IncidentCategories({
  eyebrow = "Real Incident Categories",
  title = "You'll work tickets across every major incident type",
  description = "Every category below shows up in the live ticket queue during Phase 2 and 3 — not as a case study, as an actual ticket you resolve.",
  categories = incidentCategories,
  bg = "bg-slate-50",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  categories?: readonly string[];
  bg?: string;
}) {
  return (
    <section className={`${bg} py-24`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="group inline-flex cursor-default items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-signal-300 hover:bg-signal-50 hover:text-signal-700"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-flare-500 transition-colors group-hover:text-signal-600" />
                {category}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
