import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { iconMap } from "@/components/ui/icon-map";
import { walkAwayItems } from "@/lib/site-data";

export function WalkAway() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="What You Walk Away With"
          title="Documentation that proves you did the work"
          description="Every credential below is tied to real hands-on hours, not just attendance."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {walkAwayItems.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-signal-300 hover:shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-signal-200 bg-signal-50 text-signal-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
