"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { courseFaqs, waLink } from "@/lib/site-data";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Questions, Answered"
          title="Frequently asked questions"
          description={
            <>
              Can&apos;t find what you&apos;re looking for? Message us directly on{" "}
              <a
                href={waLink("Hi, I have a question about the SOC Analyst Program.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-signal-700 hover:underline"
              >
                WhatsApp
              </a>
              .
            </>
          }
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {courseFaqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={faq.question} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-slate-100 px-6 py-5 text-sm leading-6 text-slate-600">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
