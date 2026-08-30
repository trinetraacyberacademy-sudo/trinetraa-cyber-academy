"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig, waLink } from "@/lib/site-data";

const includes = [
  "6-month live instructor-led training",
  "Hands-on Splunk, Falcon, Azure/Entra ID & Mimecast access",
  "Real incident ticket queue across 50+ categories",
  "Course completion certificate",
  "Career guidance & mock interviews",
];

export function Pricing() {
  return (
    <section id="apply" className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-radial absolute inset-0 opacity-60" />
      </div>

      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="h-1.5 w-full bg-gradient-to-r from-signal-500 via-signal-600 to-flare-500" />
            <div className="flex flex-col items-center gap-3 border-b border-slate-100 px-8 py-8 text-center sm:px-12">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-flare-200 bg-flare-50 px-4 py-1.5 text-xs font-bold tracking-wide text-flare-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                LIMITED-TIME LAUNCH OFFER
              </motion.span>

              <div className="flex items-end justify-center gap-3">
                <span className="font-display text-5xl font-bold text-slate-900 sm:text-6xl">
                  ₹{siteConfig.priceOffer.toLocaleString("en-IN")}
                </span>
                <span className="mb-1.5 text-xl font-medium text-slate-400 line-through decoration-flare-500/70 decoration-2">
                  ₹{siteConfig.priceOriginal.toLocaleString("en-IN")}
                </span>
              </div>
              <p id="contact" className="text-sm text-slate-500">
                Full 6-month program &middot;{" "}
                <span className="font-semibold text-signal-700">
                  {siteConfig.batchStatus}
                </span>
              </p>
            </div>

            <div className="px-8 py-8 sm:px-12">
              <ul className="space-y-3.5">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-signal-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                href={waLink(
                  "Hi, I'd like to enroll in the SOC Analyst Training Program. Could you share the enrollment and payment details?",
                )}
                size="lg"
                className="mt-8 w-full"
                icon={<Sparkles className="h-4 w-4" />}
              >
                Apply Now
              </Button>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:gap-6">
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-signal-700"
                >
                  <Phone className="h-4 w-4 text-signal-600" />
                  {siteConfig.phone}
                </a>
                <a
                  href={waLink("Hi, I want to know more about the SOC Analyst Program.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-signal-700"
                >
                  <MessageCircle className="h-4 w-4 text-signal-600" />
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
