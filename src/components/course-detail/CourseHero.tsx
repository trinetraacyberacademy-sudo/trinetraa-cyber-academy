"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, ListChecks, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-data";

export function CourseHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
        <div
          className="animate-pulse-slow absolute top-[-14%] left-1/2 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-signal-100/70 blur-[110px]"
          aria-hidden
        />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="relative inline-flex items-center gap-2 rounded-full border border-signal-200 bg-signal-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-signal-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-600" />
                </span>
                {siteConfig.batchStatus}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-flare-200 bg-flare-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-flare-700">
                <Users className="h-3.5 w-3.5" />
                Limited Seats Per Cohort
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
            >
              SOC Analyst Training Program
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-4 font-display text-xl font-semibold text-gradient sm:text-2xl"
            >
              Stop reading about SOC work. Start closing tickets.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-4 max-w-xl text-base leading-7 text-slate-600"
            >
              Six months of live, instructor-led training built around real tools —
              Splunk, CrowdStrike Falcon, Azure/Entra ID, and Mimecast — with a live
              incident ticket queue you actually work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                href="/register?course=soc-analyst-program"
                size="lg"
                icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              >
                Apply Now
              </Button>
              <Button
                href="#syllabus"
                variant="secondary"
                size="lg"
                icon={<ListChecks className="h-4 w-4" />}
              >
                View Syllabus
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8"
          >
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
                ₹5,999
              </span>
              <span className="mb-1.5 text-lg font-medium text-slate-400 line-through decoration-flare-500/70 decoration-2">
                ₹9,999
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              <CalendarClock className="h-3.5 w-3.5 text-signal-600" />
              6 Months · Mon–Fri · Live Online
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Includes course completion certificate and career guidance.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
