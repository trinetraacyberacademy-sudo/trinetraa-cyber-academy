"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { waLink, workshop } from "@/lib/site-data";

export function WorkshopBanner() {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div className="bg-shimmer animate-shimmer pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 py-5 text-center sm:flex-row sm:justify-center sm:gap-5 sm:py-4 sm:text-left"
        >
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-flare-500 px-3 py-1 text-xs font-bold tracking-wide text-white">
            <Sparkles className="h-3.5 w-3.5" />
            NEW
          </span>

          <p className="text-sm font-semibold text-white sm:text-base">
            {workshop.title}
            <span className="mx-2 hidden text-slate-500 sm:inline">·</span>
            <span className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-300 sm:mt-0 sm:inline-flex sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-signal-400" />
                {workshop.dateRange}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-signal-400" />
                {workshop.format}
              </span>
            </span>
          </p>

          <a
            href={waLink(
              `Hi, I'd like to reserve a seat for the ${workshop.title}. Could you share the payment details?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-flare-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flare-600"
          >
            ₹{workshop.price} — Reserve Your Seat
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
