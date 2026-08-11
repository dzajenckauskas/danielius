"use client";

import Link from "next/link";
import { ArrowUpRight, Github, LockKeyhole } from "lucide-react";
import { SectionDoodle } from "@/components/SectionDoodle";
import { projects } from "@/data/projects";
import { useActiveIndexObserver } from "@/hooks/useActiveIndexObserver";

const featuredProjectSlugs = new Set<string>([
  "lobasoft-enterprise-platform",
  "toolkit",
  "muses-fly-tying-market",
  "deliver1",
]);
const featuredProjects = projects.filter((project) => featuredProjectSlugs.has(project.slug));

export function FeaturedProjects() {
  const { activeIndex, setObservedElement } = useActiveIndexObserver<HTMLElement>(featuredProjects.length);
  const activeProject = featuredProjects[activeIndex];

  return (
    <section id="selected-work" className="featured-work" data-thread-anchor>
      <div className="featured-work-layout">
        <div className="featured-work-rail">
          <span aria-hidden className="doodle-accent doodle-accent-featured" />
          <SectionDoodle type="system" className="doodle-featured" />
          <p className="eyebrow">Selected work</p>
          <h2>Complex products, clearly engineered.</h2>
          <p className="featured-work-summary">{activeProject?.summary}</p>

          <div className="featured-work-counter">
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span>/ {String(featuredProjects.length).padStart(2, "0")}</span>
          </div>

          <div className="featured-work-progress" aria-hidden="true">
            <span
              style={{
                transform: `scaleX(${(activeIndex + 1) / featuredProjects.length})`,
              }}
            />
          </div>

          <nav aria-label="Featured projects">
            {featuredProjects.map((project, index) => (
              <a
                key={project.slug}
                href={`#featured-${project.slug}`}
                className={index === activeIndex ? "is-active" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {project.name}
              </a>
            ))}
          </nav>

          <Link href="/projects" className="link-button featured-work-all">
            View all projects
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div className="featured-work-cards">
          {featuredProjects.map((project, index) => (
            <article
              key={project.slug}
              id={`featured-${project.slug}`}
              ref={(card) => {
                setObservedElement(index, card);
              }}
              data-index={String(index + 1).padStart(2, "0")}
              className={`featured-work-card project-accent-${project.accent} ${index % 2 === 0 ? "thread-over" : "thread-under"}`}
            >
              <div>
                <p className="featured-work-meta">
                  {project.year} · {project.url ? (
                    <a className="project-domain-link" href={project.url} target="_blank" rel="noreferrer noopener" aria-label={`Visit ${project.domain}`}>
                      {project.domain}<ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : project.domain}
                </p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>

              <div>
                <ul>
                  {project.contribution.slice(0, 2).map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong> — {item.detail}
                    </li>
                  ))}
                </ul>

                <div className="featured-work-tags">
                  {project.stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                  {project.sourceAccess && (
                    <span className="featured-source-tag">
                      <LockKeyhole aria-hidden="true" />
                      Private source
                    </span>
                  )}
                  {!project.sourceAccess && project.repository && (
                    <span className="featured-source-tag">
                      <Github aria-hidden="true" />
                      Open source
                    </span>
                  )}
                </div>

                <Link href={`/projects/${project.slug}`} className="link-button">
                  Explore case study
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
