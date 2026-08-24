import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { siteConfig, waLink, workshop } from "@/lib/site-data";

export function WorkshopSection() {
  return (
    <section id="workshop" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow={workshop.eyebrow}
          title={workshop.title}
          description={workshop.tagline}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {workshop.days.map((day, i) => (
            <Reveal key={day.day} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-signal-300 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-signal-500 font-display text-sm font-bold text-signal-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">
                      {day.day}
                    </p>
                    <p className="text-xs font-medium text-flare-600">{day.date}</p>
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
                  {day.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-slate-600">
                  {day.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge tone="flare">Limited Seats</Badge>
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-slate-900">
                    ₹{workshop.price}
                  </span>
                  <span className="text-sm text-slate-500">for all 3 days</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {workshop.dateRange} &middot; {workshop.format}
                </p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {workshop.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-stretch gap-3 lg:min-w-[220px]">
                <Button href="/register?course=workshop" size="lg">
                  Reserve Your Seat
                </Button>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-signal-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {siteConfig.phone}
                </a>
                <a
                  href={waLink("Hi, I want to know more about the 3-Day Live SOC Workshop.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-signal-700"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
