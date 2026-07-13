import type { Metadata } from "next";
import { TimelineItem } from "@/components/TimelineItem";
import { Reveal } from "@/components/Reveal";
import { experience, education } from "@/data/profile";
import { SectionDoodle } from "@/components/SectionDoodle";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history and education of Danielius Zajenckauskas.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <Reveal>
        <p className="eyebrow mb-3">Professional record</p>
        <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl">
          Experience
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A timeline of my work and education — from graphic design to
          front-end engineering.
        </p>
      </Reveal>

      {/* Work */}
      <section className="relative mt-12" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-career parallax-blob" />
        <SectionDoodle type="career" className="doodle-career" />
        <Reveal>
          <h2 className="eyebrow mb-6">
            Work
          </h2>
        </Reveal>
        <div>
          {experience.map((entry, i) => (
            <Reveal
              key={entry.title}
              delay={i * 0.05}
              className={i % 2 === 0 ? "thread-over" : "thread-under"}
            >
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="relative mt-8" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-education parallax-blob" />
        <SectionDoodle type="education" className="doodle-education" />
        <Reveal>
          <h2 className="eyebrow mb-6">
            Education
          </h2>
        </Reveal>
        <div>
          {education.map((entry, i) => (
            <Reveal
              key={entry.title}
              delay={i * 0.05}
              className={i % 2 === 0 ? "thread-under" : "thread-over"}
            >
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
