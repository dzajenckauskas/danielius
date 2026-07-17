"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionDoodle } from "@/components/SectionDoodle";
import { Tag } from "@/components/Tag";
import { education, experience } from "@/data/profile";

export function ExperienceExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const activeEntry = experience[activeIndex];

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: "-38% 0px -48%", threshold: 0 },
      );
      observer.observe(card);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <>
      <section className="experience-explorer" data-thread-anchor>
        <aside className="experience-explorer-rail">
          <span aria-hidden className="doodle-accent doodle-accent-career" />
          <SectionDoodle type="nodes" className="doodle-career" />
          <p className="eyebrow">Professional record</p>
          <h1>From design systems to product engineering.</h1>
          <p>{activeEntry?.description}</p>

          <div className="experience-active-role">
            <span>{activeEntry?.year}</span>
            <strong>{activeEntry?.title}</strong>
            <small>{activeEntry?.org}</small>
          </div>

          <nav aria-label="Career timeline">
            {experience.map((entry, index) => (
              <a
                key={`${entry.title}-${entry.year}`}
                href={`#experience-${entry.year}-${index}`}
                className={index === activeIndex ? "is-active" : undefined}
              >
                <span>{entry.year}</span>
                {entry.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="experience-card-list">
          {experience.map((entry, index) => (
            <article
              key={`${entry.title}-${entry.year}`}
              id={`experience-${entry.year}-${index}`}
              ref={(card) => {
                cardRefs.current[index] = card;
              }}
              className={`experience-card ${index % 2 === 0 ? "thread-over" : "thread-under"}`}
              data-year={entry.year}
            >
              <svg className="experience-card-doodle" viewBox="0 0 80 80" aria-hidden="true" fill="none">
                {/* Hand-drawn briefcase, matching the section-doodle language. */}
                <path d="M17 35.5c-.2-1.9 1.2-3.6 3.1-3.8 13.3-1 26.6-1 39.8 0 1.9.2 3.3 1.9 3.1 3.8-.4 7.3-.6 14.6-.6 21.9 0 1.9-1.5 3.4-3.4 3.5-12.5.7-25.1.7-37.6 0-1.9-.1-3.4-1.6-3.4-3.5 0-7.3-.2-14.6-.6-21.9Z" />
                <path d="M32 32c-.5-3.4-.6-7.1 1.4-9.6 1.7-2.1 4.4-2.4 7-2.4s5.3.3 7 2.4c2 2.5 1.9 6.2 1.4 9.6" />
                <path d="M16 43c16.2-1.2 32.5-1.2 48.7 0" />
                <path d="M35.5 40.5c3-.4 6-.4 9 0 .3 2 .3 4 0 6-3 .4-6 .4-9 0-.3-2-.3-4 0-6Z" />
              </svg>
              <p>{entry.period}</p>
              <h2>{entry.title}</h2>
              {entry.org && <h3>{entry.org}</h3>}
              {entry.description && <p className="experience-card-description">{entry.description}</p>}
              {entry.tags && (
                <div className="experience-card-tags">
                  {entry.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="education-editorial" data-thread-anchor>
        <Reveal className="education-editorial-heading">
          <span aria-hidden className="doodle-accent doodle-accent-education" />
          <SectionDoodle type="document" className="doodle-education" />
          <p className="eyebrow">Education</p>
          <h2>Design foundations, engineering practice.</h2>
        </Reveal>
        <div className="education-card-grid">
          {education.map((entry, index) => (
            <Reveal
              key={`${entry.title}-${entry.year}`}
              delay={index * 0.04}
              className={`education-card ${index % 2 === 0 ? "thread-over" : "thread-under"}`}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{entry.period}</small>
              <h3>{entry.org || entry.title}</h3>
              <p>{entry.org ? entry.title : entry.description}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
