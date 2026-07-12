import type { Metadata } from "next";
import { TimelineItem } from "@/components/TimelineItem";
import { Reveal } from "@/components/Reveal";
import { experience, education } from "@/data/profile";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history and education of Danielius Zajenckauskas.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <Reveal>
        <h1 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Experience
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A timeline of my work and education — from graphic design to
          front-end engineering.
        </p>
      </Reveal>

      {/* Work */}
      <section className="mt-12">
        <Reveal>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-subtle">
            Work
          </h2>
        </Reveal>
        <div>
          {experience.map((entry, i) => (
            <Reveal key={entry.title} delay={i * 0.05}>
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-8">
        <Reveal>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-subtle">
            Education
          </h2>
        </Reveal>
        <div>
          {education.map((entry, i) => (
            <Reveal key={entry.title} delay={i * 0.05}>
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
