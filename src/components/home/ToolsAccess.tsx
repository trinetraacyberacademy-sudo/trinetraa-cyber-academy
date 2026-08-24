import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { iconMap } from "@/components/ui/icon-map";
import { tools } from "@/lib/site-data";

export function ToolsAccess({
  bg = "bg-white",
  description = "No sandboxed demos. You'll log in, click around, break things, and fix them — inside the same platforms SOC teams run every day.",
}: {
  bg?: string;
  description?: string;
}) {
  return (
    <section className={`${bg} py-24`}>
      <Container>
        <SectionHeading
          eyebrow="Real Tool Access"
          title="Tools you get real access to"
          description={description}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => {
            const Icon = iconMap[tool.icon];
            return (
              <Reveal key={tool.name} delay={(i % 3) * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-signal-300 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-signal-200 bg-signal-50 text-signal-600 transition-colors group-hover:bg-signal-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-5 inline-block text-xs font-semibold tracking-widest text-flare-600 uppercase">
                    {tool.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">
                    {tool.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {tool.description}
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
