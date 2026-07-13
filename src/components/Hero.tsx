import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { profile } from "@/data/profile";

function NameLine({ children, offset = 0 }: { children: string; offset?: number }) {
  const animationOrder = [7, 18, 2, 13, 21, 5, 16, 0, 11, 19, 4, 15, 9, 22, 1, 17, 6, 12, 20, 3, 14, 8, 10];
  const animationTypes = ["hop", "tilt", "nudge", "squash"] as const;

  return (
    <span className="hero-name-line" aria-hidden="true">
      {Array.from(children).map((letter, index) => {
        const globalIndex = index + offset;
        const order = animationOrder.indexOf(globalIndex);
        const animationType = animationTypes[(globalIndex * 7 + 3) % animationTypes.length];

        return (
          <span
            className="hero-letter-shell"
            style={{
              animationDelay: `${0.12 + globalIndex * 0.035}s`,
              "--letter-order": order,
              "--letter-delay": `${1.8 + order * 0.5}s`,
            } as React.CSSProperties}
            key={`${letter}-${index}`}
          >
            <span className={`hero-letter hero-letter-${animationType}`}>{letter}</span>
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  return (
    <section className="hero-editorial">
      <div className="hero-editorial-layout">
        <div className="hero-intro">
          <Reveal>
            <p className="eyebrow">Product engineering · Front-end systems</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="sr-only">{profile.name}</h1>
            <div className="hero-name" aria-hidden="true" data-thread-anchor data-thread-x="310">
              <NameLine>DANIELIUS</NameLine>
              <NameLine offset={9}>ZAJENČKAUSKAS</NameLine>
            </div>
          </Reveal>

          <Reveal delay={0.13}>
            <p className="hero-intro-copy">{profile.tagline}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hero-actions">
              <Link href="/projects" className="primary-button group">
                Explore selected work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="/api/resume" download className="secondary-button">
                <Download className="h-4 w-4" />
                Download CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="hero-intro-footer">
              <span className="hero-availability-dot" aria-hidden="true" />
              <span>{profile.availability}</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="hero-portrait-wrap">
          <div className="hero-portrait-stage" data-thread-anchor data-thread-x="490">
            <div className="hero-photo-composition">
              <span aria-hidden className="hero-photo-blob hero-photo-blob-back" />
              <span aria-hidden className="hero-photo-blob hero-photo-blob-side" />
              <span aria-hidden className="hero-photo-blob hero-photo-blob-back-accent" />
              <div className="hero-portrait-frame">
                <Image
                  src="/avatar.jpg"
                  alt={profile.name}
                  width={720}
                  height={820}
                  priority
                  sizes="(max-width: 900px) 100vw, 44vw"
                  style={{ filter: "var(--photo-filter)" }}
                />
              </div>
              <span aria-hidden className="hero-photo-blob hero-photo-blob-front" />
              <span aria-hidden className="hero-photo-blob hero-photo-blob-front-accent" />
            </div>

            <div className="hero-portrait-footer">
              <div className="hero-portrait-caption">
                <p><MapPin aria-hidden="true" />{profile.location.toUpperCase()}</p>
              </div>
              <div className="hero-socials" aria-label="Profile links">
                <a href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                  <Github aria-hidden="true" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                  <Linkedin aria-hidden="true" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <Mail aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <a className="hero-scroll-cue" href="#selected-work">
        Scroll through the work
        <ArrowDownRight aria-hidden="true" />
      </a>
    </section>
  );
}
