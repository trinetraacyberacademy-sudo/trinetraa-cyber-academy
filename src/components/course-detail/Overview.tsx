import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { iconMap } from "@/components/ui/icon-map";
import { stats } from "@/lib/site-data";

export function Overview() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-24">
      <Container>
        <SectionHeading
          eyebrow="Program Overview"
          title="Two months of foundation. Four months of the real thing."
          description="You don't spend six months in slides. You spend two months getting SOC-ready, then four months actually working a live incident ticket queue inside the tools real analysts use."
        />

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon];
            return (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-signal-300 hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-signal-200 bg-signal-50 text-signal-600 transition-colors group-hover:bg-signal-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    {stat.unit && (
                      <span className="ml-1.5 text-lg font-medium text-slate-500">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{stat.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
