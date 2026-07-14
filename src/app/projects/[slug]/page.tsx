import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Github,
  LockKeyhole,
  MapPin,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex(({ slug }) => slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <article className={`project-detail project-accent-${project.accent}`}>
      <span aria-hidden className="project-page-blob project-detail-blob parallax-blob" />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-18">
        <Reveal>
          <Link href="/projects" className="project-back-link">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="eyebrow mb-3">{project.year} · Selected work</p>
            <h1 className="text-4xl font-black tracking-tight text-text sm:text-6xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {project.summary}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.url && (
              <a className="primary-button group" href={project.url} target="_blank" rel="noreferrer noopener">
                Visit {project.domain}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            )}
            {project.repository && (
              <a className="secondary-button" href={project.repository} target="_blank" rel="noreferrer noopener">
                <Github className="h-4 w-4" aria-hidden />
                View repository
              </a>
            )}
          </div>

          {project.sourceAccess && (
            <div className="private-source-note">
              <LockKeyhole aria-hidden="true" />
              <div>
                <strong>Private codebase</strong>
                <p>{project.sourceAccess.note}</p>
              </div>
              <a
                className="link-button"
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Private code walkthrough — ${project.name}`)}`}
              >
                Request walkthrough
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08} className="thread-over">
          <dl className="project-facts mt-12">
            <div>
              <BriefcaseBusiness aria-hidden />
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <MapPin aria-hidden />
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <CalendarDays aria-hidden />
              <dt>Engagement</dt>
              <dd>{project.engagement}</dd>
            </div>
            <div>
              <Clock3 aria-hidden />
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
          </dl>
        </Reveal>

        <section className="project-copy-grid" data-thread-anchor>
          <Reveal>
            <h2 className="eyebrow">About the project</h2>
          </Reveal>
          <div className="space-y-4">
            {project.about.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.05}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="project-proof-section" data-thread-anchor>
          <Reveal>
            <p className="eyebrow">Engineering proof</p>
            <h2>What was hard, what I chose, and how I checked it.</h2>
          </Reveal>

          <div className="project-proof-grid">
            <Reveal className="project-proof-card thread-over">
              <span>01</span>
              <h3>Challenge</h3>
              <p>{project.caseStudy.challenge}</p>
            </Reveal>

            <Reveal delay={0.05} className="project-proof-card thread-under">
              <span>02</span>
              <h3>Product &amp; engineering decisions</h3>
              <ul>
                {project.caseStudy.decisions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="project-proof-card thread-over">
              <span>03</span>
              <h3>Quality &amp; outcome</h3>
              <ul>
                {project.caseStudy.quality.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="project-proof-outcome">{project.caseStudy.outcome}</p>
            </Reveal>
          </div>
        </section>

        <section className="project-copy-grid" data-thread-anchor>
          <Reveal>
            <h2 className="eyebrow">My contribution</h2>
          </Reveal>
          <Reveal className="thread-over">
            <ul className="project-contribution-list">
              {project.contribution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="project-copy-grid" data-thread-anchor>
          <Reveal>
            <h2 className="eyebrow">Technology</h2>
          </Reveal>
          <Reveal>
            <div className="project-stack-list">
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Reveal>
        </section>

        <Reveal>
          <Link href={`/projects/${nextProject.slug}`} className="next-project-link">
            <span>
              <small>Next project</small>
              <strong>{nextProject.name}</strong>
            </span>
            <ArrowRight aria-hidden />
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
