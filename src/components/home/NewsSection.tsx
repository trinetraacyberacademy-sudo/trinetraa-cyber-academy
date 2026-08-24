import { ArrowUpRight, Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newsItems } from "@/lib/site-data";

export function NewsSection() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <SectionHeading
          eyebrow="Stay Sharp"
          title="Latest in Cybersecurity"
          description="A quick pulse on the threats and trends shaping the SOC world right now."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {newsItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-signal-300 hover:shadow-md">
                <div className="bg-grid-fine relative flex h-40 items-center justify-center overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-100/60 to-signal-50" />
                  <Newspaper className="relative h-9 w-9 text-signal-300" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-flare-200 bg-flare-50 px-2.5 py-1 font-semibold text-flare-700">
                      {item.category}
                    </span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-slate-600">
                    {item.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-700">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
