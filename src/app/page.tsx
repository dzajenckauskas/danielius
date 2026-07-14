import { Hero } from "@/components/Hero";
import { SkillGroup } from "@/components/SkillGroup";
import { Reveal } from "@/components/Reveal";
import { Tag } from "@/components/Tag";
import { SectionDoodle } from "@/components/SectionDoodle";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { ArrowUpRight } from "lucide-react";
import {
  profile,
  skillGroups,
  languages,
  interests,
} from "@/data/profile";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="proof-strip" aria-label="Engineering scope" data-thread-anchor>
        <Reveal>
          <dl>
            <div>
              <dt>35</dt>
              <dd>enterprise applications</dd>
            </div>
            <div>
              <dt>12</dt>
              <dd>shared platform packages</dd>
            </div>
            <div>
              <dt>11</dt>
              <dd>marketplace workspaces</dd>
            </div>
            <div>
              <dt>{projects.length}</dt>
              <dd>selected case studies</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <FeaturedProjects />

      {/* About */}
      <section className="home-editorial-section relative mx-auto max-w-6xl px-5 py-16" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-about parallax-blob" />
        <span aria-hidden className="doodle-accent doodle-accent-about" />
        <SectionDoodle type="pencil" className="doodle-about" />
        <div className="home-section-rail">
          <Reveal>
            <p className="eyebrow">About</p>
            <h2>Product thinking, platform discipline.</h2>
            <p>
              I combine front-end engineering with a graphic communication design background to
              make complex product workflows easier to understand and maintain.
            </p>
          </Reveal>
        </div>
        <div className="home-editorial-cards">
          {profile.about.map((para, i) => (
            <Reveal
              key={para}
              delay={i * 0.05}
              className={`home-editorial-card ${i % 2 === 0 ? "thread-over" : "thread-under"}`}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="home-editorial-section relative mx-auto max-w-6xl px-5 py-16" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-skills parallax-blob" />
        <SectionDoodle type="code" className="doodle-skills" />
        <div className="home-section-rail">
          <Reveal>
            <p className="eyebrow">Engineering capabilities</p>
            <h2>Beyond the framework.</h2>
            <p>
              Product judgement, architecture, data, performance and reliability—supported by
              tools chosen for the work.
            </p>
          </Reveal>
        </div>
        <div className="home-skill-cards">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.label}
              delay={i * 0.05}
              className={i % 3 === 1 ? "thread-under" : "thread-over"}
            >
              <SkillGroup group={group} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Languages + Interests */}
      <section className="home-info-editorial relative mx-auto max-w-6xl px-5 py-16" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-languages parallax-blob" />
        <span aria-hidden className="doodle-accent doodle-accent-languages" />
        <SectionDoodle type="speech" className="doodle-languages" />
        <Reveal className="home-info-heading thread-over">
          <p className="eyebrow">Perspective</p>
          <h2>Language in work, curiosity beyond it.</h2>
          <p>Clear communication across teams, with interests that keep the work grounded and observant.</p>
        </Reveal>
        <div className="home-info-card-grid">
          <Reveal className="home-info-card thread-over">
            <span className="home-info-number">01</span>
            <div className="home-info-content">
              <small>Communication</small>
              <h3>Languages</h3>
              <ul>
                {languages.map((l) => (
                  <li key={l.name}>
                    <span>{l.name}</span>
                    <small>{l.level}</small>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.05} className="home-info-card thread-under">
            <span className="home-info-number">02</span>
            <div className="home-info-content">
              <small>Outside the screen</small>
              <h3>Beyond Code</h3>
              <div className="home-interest-list">
                {interests.map((interest) => (
                  <Tag key={interest}>{interest}</Tag>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="home-contact-section relative mx-auto max-w-6xl px-5 py-20" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-cta parallax-blob" />
        <span aria-hidden className="doodle-accent doodle-accent-contact" />
        <SectionDoodle type="contact" className="doodle-contact" />
        <Reveal className="thread-over">
          <div className="cta-panel">
            <div className="cta-copy">
              <p className="eyebrow">Available for selected work</p>
              <h2>Let’s make complex products feel clear.</h2>
              <p>
                Open to thoughtful product engineering work where quality and maintainability matter.
              </p>
            </div>

            <div className="cta-contact">
              <span>Start a conversation</span>
              <a href={`mailto:${profile.email}`} className="link-button">
                {profile.email}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
