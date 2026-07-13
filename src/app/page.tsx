import { Hero } from "@/components/Hero";
import { SkillGroup } from "@/components/SkillGroup";
import { Reveal } from "@/components/Reveal";
import { Tag } from "@/components/Tag";
import { SectionDoodle } from "@/components/SectionDoodle";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import {
  profile,
  skillGroups,
  languages,
  interests,
} from "@/data/profile";

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
              <dt>5</dt>
              <dd>selected case studies</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <FeaturedProjects />

      {/* About */}
      <section className="relative mx-auto max-w-4xl px-5 py-12" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-about parallax-blob" />
        <SectionDoodle type="pencil" className="doodle-about" />
        <Reveal>
          <h2 className="eyebrow">
            About
          </h2>
        </Reveal>
        <div className="mt-4 space-y-4">
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="relative mx-auto max-w-4xl px-5 py-12" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-skills parallax-blob" />
        <SectionDoodle type="code" className="doodle-skills" />
        <Reveal>
          <h2 className="eyebrow">
            Skills &amp; Tools
          </h2>
        </Reveal>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.label}
              delay={i * 0.05}
              className={i % 3 === 1 ? "thread-under" : "thread-over"}
            >
              <SkillGroup group={group} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Languages + Interests */}
      <section className="relative mx-auto max-w-4xl px-5 py-12" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-languages parallax-blob" />
        <SectionDoodle type="speech" className="doodle-languages" />
        <SectionDoodle type="bike" className="doodle-interests" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Reveal className="thread-over">
            <h2 className="eyebrow">
              Languages
            </h2>
            <ul className="mt-4 space-y-2">
              {languages.map((l) => (
                <li
                  key={l.name}
                  className="flex items-center justify-between border-b border-border/60 pb-2 text-[15px]"
                >
                  <span className="text-text">{l.name}</span>
                  <span className="text-subtle">{l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.05} className="thread-under">
            <h2 className="eyebrow">
              Beyond Code
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-4xl px-5 py-16" data-thread-anchor>
        <span aria-hidden className="section-blob section-blob-cta parallax-blob" />
        <SectionDoodle type="contact" className="doodle-contact" />
        <Reveal className="thread-over">
          <div className="cta-panel relative overflow-hidden rounded-3xl border border-border bg-surface/60 px-6 py-12 text-center sm:px-10">
            <div aria-hidden className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[var(--blob-1)] blur-3xl" />
            <h2 className="relative text-2xl font-black text-text">Building products that perform.</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Available for selected opportunities where product quality,
              thoughtful engineering and long-term maintainability matter.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="primary-button relative mt-6"
            >
              {profile.email}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
