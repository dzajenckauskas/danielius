import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowRight, Download, MapPin } from "lucide-react";
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
    <section className="relative overflow-hidden">
      {/* Soft colour fields echo the abstract shapes used in the printed CV. */}
      <div
        aria-hidden
        className="blob parallax-blob -left-20 top-4 -z-10 h-[24rem] w-[24rem] opacity-45 sm:h-[34rem] sm:w-[34rem]"
        style={{ background: "var(--blob-1)" }}
      />
      <div
        aria-hidden
        className="blob parallax-blob right-[8%] top-40 -z-10 h-28 w-28 opacity-55 sm:h-40 sm:w-40"
        style={{ background: "var(--blob-2)" }}
      />
      <div aria-hidden className="hero-shape hero-shape-one parallax-blob" />
      <div aria-hidden className="hero-shape hero-shape-two parallax-blob" />
      <div aria-hidden className="hero-shape hero-shape-three parallax-blob" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-14 pt-16 text-center sm:pt-24">
        <Reveal>
          <div
            className="group relative h-32 w-32 sm:h-36 sm:w-36"
            data-thread-anchor
            data-thread-x="430"
            data-thread-loops="1"
            data-thread-radius="64"
            data-thread-center="true"
          >
            <Image
              src="/avatar.jpg"
              alt={profile.name}
              width={144}
              height={144}
              priority
              className="h-full w-full rounded-full object-cover shadow-[0_18px_45px_-24px_rgba(20,30,35,0.55)] transition-transform duration-700 group-hover:scale-[1.018]"
              style={{ filter: "var(--photo-filter)" }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="sr-only">{profile.name}</h1>
          <div
            className="hero-name mx-auto mt-7"
            aria-hidden="true"
            data-thread-anchor
            data-thread-x="330"
            data-thread-loops="0"
            data-thread-radius="68"
            data-thread-center="true"
          >
            <NameLine>DANIELIUS</NameLine>
            <NameLine offset={9}>ZAJENČKAUSKAS</NameLine>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="hero-tagline mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-subtle">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-6 flex items-center justify-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="social-button"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="social-button"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="social-button"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.34}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/experience"
              className="primary-button group"
            >
              View my experience
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="/api/resume" download className="secondary-button">
              <Download className="h-4 w-4" />
              Download CV
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="secondary-button"
            >
              Get in touch
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {profile.availability}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
