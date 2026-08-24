import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig, waLink } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact | Trinetraa Cyber Academy",
  description: "Get in touch with Trinetraa Cyber Academy.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
      </div>
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Get in Touch
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Questions about the program or workshop? Send us a message, or reach out
              directly.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex h-full flex-col justify-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition-colors hover:border-signal-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
                  <Phone className="h-4 w-4" />
                </span>
                {siteConfig.phone}
              </a>
              <a
                href={waLink("Hi, I have a question about Trinetraa Cyber Academy.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition-colors hover:border-signal-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
                  <MessageCircle className="h-4 w-4" />
                </span>
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition-colors hover:border-signal-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
                  <Mail className="h-4 w-4" />
                </span>
                {siteConfig.email}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
