import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkedInIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { navLinks, siteConfig } from "@/lib/site-data";

const socialLinks = [
  { Icon: LinkedInIcon, href: siteConfig.linkedinUrl, label: "LinkedIn" },
  { Icon: InstagramIcon, href: siteConfig.instagramUrl, label: "Instagram" },
  { Icon: WhatsAppIcon, href: siteConfig.whatsappHref, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex">
              {/* White chip behind the logo — its wordmark is dark navy/grey and
                  needs a light background to stay legible on this dark footer. */}
              <span className="inline-flex items-center rounded-xl bg-white px-3 py-2">
                <Image
                  src="/trinetraa-logo.png"
                  alt="Trinetraa Cyber Academy"
                  width={677}
                  height={369}
                  className="h-12 w-auto"
                />
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Trinetraa Cyber Academy on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-slate-400 transition-colors hover:border-signal-500/50 hover:text-signal-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-signal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-signal-400" />
                <a href={siteConfig.phoneHref} className="hover:text-signal-400">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-signal-400" />
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-signal-400"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-signal-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-signal-400"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-800 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Trinetraa Cyber Academy. All rights
            reserved.
          </p>
          <p>Built for analysts who ship, not just study.</p>
        </div>
      </Container>
    </footer>
  );
}
