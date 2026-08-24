"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { navLinks, siteConfig } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-slate-200 shadow-sm" : "border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/trinetraa-logo.png"
            alt="Trinetraa Cyber Academy"
            width={677}
            height={369}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-signal-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinetraa Cyber Academy on LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-signal-300 hover:text-signal-600"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinetraa Cyber Academy on Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-signal-300 hover:text-signal-600"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
          <Button href="/register" size="md">
            Apply Now
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-signal-700"
                >
                  {link.label}
                </Link>
              ))}
              <Button href="/register" size="md" className="mt-3 w-full">
                Apply Now
              </Button>
              <div className="mt-4 flex items-center justify-center gap-3 border-t border-slate-100 pt-4">
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Trinetraa Cyber Academy on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-signal-300 hover:text-signal-600"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Trinetraa Cyber Academy on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-signal-300 hover:text-signal-600"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
