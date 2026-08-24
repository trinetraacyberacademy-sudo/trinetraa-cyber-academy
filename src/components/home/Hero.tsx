"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Radio, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-data";

const toolPills = ["Splunk", "CrowdStrike Falcon", "Azure / Entra ID", "Mimecast"];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Soft, restrained background layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
        <div
          className="animate-pulse-slow absolute top-[-14%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-signal-100/70 blur-[110px]"
          aria-hidden
        />
        <div
          className="animate-float absolute top-20 right-[6%] h-56 w-56 rounded-full bg-flare-100/60 blur-[90px]"
          aria-hidden
        />
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
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
            className="mt-8 max-w-4xl font-display text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-6xl"
          >
            Stop reading about SOC work.{" "}
            <span className="text-gradient">Start closing tickets.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
          >
            A 6-month <span className="font-medium text-slate-800">live SOC Analyst training + internship</span> program
            built around real tools, not theory. Get hands-on access to Splunk, CrowdStrike
            Falcon, Microsoft Azure/Entra ID, and Mimecast — and graduate having actually
            worked incidents, not just studied them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            {toolPills.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tool}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              href="/register"
              size="lg"
              icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            >
              Apply Now
            </Button>
            <Button
              href="/courses/soc-analyst-program"
              variant="secondary"
              size="lg"
              icon={<BookOpenText className="h-4 w-4" />}
            >
              View Curriculum
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-8 flex items-center gap-2 text-xs text-slate-500"
          >
            <Radio className="h-3.5 w-3.5 text-signal-600" />
            Live sessions · Real incident queues · Internship certificate included
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
