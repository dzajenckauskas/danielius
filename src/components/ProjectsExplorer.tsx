"use client";

import Link from "next/link";
import { ArrowUpRight, Github, LockKeyhole } from "lucide-react";
import { SectionDoodle } from "@/components/SectionDoodle";
import { projects } from "@/data/projects";
import { useActiveIndexObserver } from "@/hooks/useActiveIndexObserver";

export function ProjectsExplorer() {
  const { activeIndex, setObservedElement } = useActiveIndexObserver<HTMLElement>(projects.length);
  const activeProject = projects[activeIndex];

  return (
    <div className="projects-explorer">
      <aside className="projects-explorer-rail">
        <span aria-hidden className="doodle-accent doodle-accent-projects" />
        <SectionDoodle type="document" className="doodle-projects" />
        <p className="eyebrow">Selected work</p>
        <h1>Products built around real workflows.</h1>
        <p className="projects-explorer-summary">{activeProject?.summary}</p>

        <div className="projects-explorer-counter">
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>/ {String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="projects-explorer-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(activeIndex + 1) / projects.length})` }} />
        </div>

        <nav aria-label="Project index">
          {projects.map((project, index) => (
            <a
              key={project.slug}
              href={`#project-${project.slug}`}
              className={index === activeIndex ? "is-active" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {project.name}
            </a>
          ))}
        </nav>
      </aside>

      <div className="projects-explorer-list">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            id={`project-${project.slug}`}
            ref={(card) => {
              setObservedElement(index, card);
            }}
            data-index={String(index + 1).padStart(2, "0")}
            className={`projects-explorer-card project-accent-${project.accent} ${index % 2 === 0 ? "thread-over" : "thread-under"}`}
            data-thread-anchor
          >
            <header>
              <p>
                {project.year} · {project.url ? (
                  <a className="project-domain-link" href={project.url} target="_blank" rel="noreferrer noopener" aria-label={`Visit ${project.domain}`}>
                    {project.domain}<ArrowUpRight aria-hidden="true" />
                  </a>
                ) : project.domain}
              </p>
              <h2>{project.name}</h2>
              <span>{project.role}</span>
            </header>

            <p className="projects-explorer-description">{project.summary}</p>

            <div className="projects-explorer-evidence">
              <div>
                <small>Challenge</small>
                <p>{project.caseStudy.challenge}</p>
              </div>
              <div>
                <small>Outcome</small>
                <p>{project.cardOutcome}</p>
              </div>
            </div>

            <footer>
              <div className="projects-explorer-tags">
                {project.stack.slice(0, 6).map((item) => <span key={item}>{item}</span>)}
                {project.sourceAccess && (
                  <span className="is-private"><LockKeyhole aria-hidden="true" />Private source</span>
                )}
                {!project.sourceAccess && project.repository && (
                  <span className="is-open-source"><Github aria-hidden="true" />Open source</span>
                )}
              </div>
              <Link href={`/projects/${project.slug}`} className="link-button">
                Read case study
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
