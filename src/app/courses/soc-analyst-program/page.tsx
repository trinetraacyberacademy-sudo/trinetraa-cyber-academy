import type { Metadata } from "next";
import { CourseHero } from "@/components/course-detail/CourseHero";
import { StickyApplyBar } from "@/components/course-detail/StickyApplyBar";
import { Overview } from "@/components/course-detail/Overview";
import { Syllabus } from "@/components/course-detail/Syllabus";
import { ToolsAccess } from "@/components/home/ToolsAccess";
import { IncidentCategories } from "@/components/home/IncidentCategories";
import { InterviewReady } from "@/components/course-detail/InterviewReady";
import { WalkAway } from "@/components/course-detail/WalkAway";
import { PlacementAssistance } from "@/components/course-detail/PlacementAssistance";
import { FaqSection } from "@/components/course-detail/FaqSection";
import { Pricing } from "@/components/home/Pricing";
import { courseIncidentCategories } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "SOC Analyst Training + Internship Program | Trinetraa Cyber Academy",
  description:
    "A 6-month live SOC Analyst training + internship program with hands-on access to Splunk, CrowdStrike Falcon, Azure/Entra ID and Mimecast. Full syllabus, incident categories, FAQs, and pricing.",
};

export default function SocAnalystProgramPage() {
  return (
    <>
      <CourseHero />
      <StickyApplyBar />
      <Overview />
      <Syllabus />
      <ToolsAccess bg="bg-slate-50" />
      <IncidentCategories
        eyebrow="Incident Categories You'll Handle"
        title="Real incidents, mapped to every phase of the program"
        description="From Phase 2 onward, every category below shows up in your live ticket queue — not as a slide, as a ticket with your name on it."
        categories={courseIncidentCategories}
        bg="bg-white"
      />
      <InterviewReady />
      <WalkAway />
      <PlacementAssistance />
      <FaqSection />
      <Pricing />
    </>
  );
}
