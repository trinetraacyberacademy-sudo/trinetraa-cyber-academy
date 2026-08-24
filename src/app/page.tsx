import { Hero } from "@/components/home/Hero";
import { WorkshopBanner } from "@/components/home/WorkshopBanner";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ToolsAccess } from "@/components/home/ToolsAccess";
import { ProgramTimeline } from "@/components/home/ProgramTimeline";
import { WorkshopSection } from "@/components/home/WorkshopSection";
import { IncidentCategories } from "@/components/home/IncidentCategories";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsSection } from "@/components/home/NewsSection";
import { Pricing } from "@/components/home/Pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkshopBanner />
      <StatsStrip />
      <ToolsAccess />
      <ProgramTimeline />
      <WorkshopSection />
      <IncidentCategories />
      <Testimonials />
      <NewsSection />
      <Pricing />
    </>
  );
}
