import { Hero } from "@/components/Hero";
import { SkillGroup } from "@/components/SkillGroup";
import { Reveal } from "@/components/Reveal";
import { Tag } from "@/components/Tag";
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

      {/* About */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <Reveal>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
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
      <section className="mx-auto max-w-4xl px-5 py-12">
        <Reveal>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Skills &amp; Tools
          </h2>
        </Reveal>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <SkillGroup group={group} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Languages + Interests */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
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
          <Reveal delay={0.05}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
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
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface/40 px-6 py-10 text-center">
            <h2 className="text-2xl font-bold text-text">Let&apos;s build something.</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">
              I&apos;m currently open to new front-end opportunities. Feel free to
              reach out.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {profile.email}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
