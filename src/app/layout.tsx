import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trinetraa Cyber Academy | 6-Month Live SOC Analyst Training & Internship",
  description:
    "Stop reading about SOC work. Start closing tickets. A 6-month live SOC Analyst training + internship program with hands-on access to Splunk, CrowdStrike Falcon, Microsoft Azure/Entra ID and Mimecast.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {/* Safety net: scroll-reveal sections start at opacity:0 in the server
            HTML and rely on Framer Motion (client JS) to fade them in. If
            hydration is ever slow, blocked, or errors out, this guarantees
            content still becomes visible instead of staying blank forever. */}
        <Script id="reveal-fallback" strategy="beforeInteractive">
          {`setTimeout(function () {
            document.documentElement.classList.add("force-reveal");
          }, 2500);`}
        </Script>
        <noscript>
          <style>{`[style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
