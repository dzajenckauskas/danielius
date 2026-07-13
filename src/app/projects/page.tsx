import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected digital products and web platforms developed by Danielius Zajenčkauskas.",
};

const groupedProjects = Object.entries(
  projects.reduce<Record<string, typeof projects>>((groups, project) => {
    (groups[project.year] ??= []).push(project);
    return groups;
  }, {}),
).sort(([a], [b]) => Number(b) - Number(a));

export default function ProjectsPage() {
  return (
    <div className="projects-page mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <span aria-hidden className="project-page-blob project-page-blob-one parallax-blob" />
      <span aria-hidden className="project-page-blob project-page-blob-two parallax-blob" />

      <Reveal>
        <p className="eyebrow mb-3">Selected work</p>
        <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl">Projects</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          Commercial platforms and independent products spanning e-commerce,
          healthcare, real estate and international relocation.
        </p>
      </Reveal>

      <div className="mt-14 space-y-14">
        {groupedProjects.map(([year, entries], groupIndex) => (
          <section key={year} className="relative" data-thread-anchor>
            <Reveal>
              <div className="project-year-row">
                <h2>{year}</h2>
                <span aria-hidden />
              </div>
            </Reveal>

            <div className="mt-4 space-y-3">
              {entries.map((project, index) => (
                <Reveal
                  key={project.slug}
                  delay={index * 0.05}
                  className={(groupIndex + index) % 2 ? "thread-under" : "thread-over"}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`project-list-card project-accent-${project.accent}`}
                  >
                    <span className="project-card-index" aria-hidden>
                      {String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="project-card-heading">
                        <strong>{project.name}</strong>
                        <small>{project.domain}</small>
                      </span>
                      <span className="project-card-summary">{project.summary}</span>
                      <span className="project-card-tags">
                        {project.stack.slice(0, 4).map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </span>
                    </span>
                    <ArrowUpRight className="project-card-arrow" aria-hidden />
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

