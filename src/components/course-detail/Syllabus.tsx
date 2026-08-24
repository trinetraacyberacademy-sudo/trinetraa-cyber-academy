import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SyllabusAccordion } from "./SyllabusAccordion";

export function Syllabus() {
  return (
    <section id="syllabus" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Full Syllabus"
          title="Four phases, organized by SOC level"
          description="Tap any phase to expand its modules. Color-coded by level so you always know how deep you are into the program."
        />
        <SyllabusAccordion />
      </Container>
    </section>
  );
}
