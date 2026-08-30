"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { waLink } from "@/lib/site-data";

const applyWaLink = waLink(
  "Hi, I'd like to enroll in the SOC Analyst Training Program. Could you share the enrollment and payment details?",
);

export function StickyApplyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile: full-width fixed bottom bar */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold text-slate-900">₹5,999</p>
                <p className="text-[11px] text-slate-500 line-through">₹9,999</p>
              </div>
              <a
                href={applyWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-signal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-signal-600/20"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Desktop: floating pill, bottom-right */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-6 bottom-6 z-40 hidden sm:block"
          >
            <a
              href={applyWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 py-3 pr-5 pl-5 shadow-xl shadow-slate-300/40 backdrop-blur-md transition-transform hover:-translate-y-0.5"
            >
              <div className="text-left">
                <p className="text-[11px] font-medium text-slate-400 line-through">₹9,999</p>
                <p className="font-display text-base font-bold text-slate-900">₹5,999</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-signal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-signal-600/20 transition-colors group-hover:bg-signal-700">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
