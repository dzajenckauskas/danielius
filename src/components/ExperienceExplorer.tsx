"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/Reveal";
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
          <p className="eyebrow">Professional record</p>
          <h1>From visual systems to product engineering.</h1>
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
              className="experience-card"
              data-year={entry.year}
            >
              <BriefcaseBusiness aria-hidden="true" />
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
          <GraduationCap aria-hidden="true" />
          <p className="eyebrow">Education</p>
          <h2>Design foundations, engineering practice.</h2>
        </Reveal>
        <div className="education-card-grid">
          {education.map((entry, index) => (
            <Reveal key={`${entry.title}-${entry.year}`} delay={index * 0.04} className="education-card">
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
