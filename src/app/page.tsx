import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ToolsAccess } from "@/components/home/ToolsAccess";
import { ProgramTimeline } from "@/components/home/ProgramTimeline";
import { IncidentCategories } from "@/components/home/IncidentCategories";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsSection } from "@/components/home/NewsSection";
import { Pricing } from "@/components/home/Pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ToolsAccess />
      <ProgramTimeline />
      <IncidentCategories />
      <Testimonials />
      <NewsSection />
      <Pricing />
    </>
  );
}
