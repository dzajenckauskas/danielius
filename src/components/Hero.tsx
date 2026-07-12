import Image from "next/image";
import Link from "next/link";
import { Github, Mail, ArrowRight, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* radial accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8%] -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--glow)" }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-14 pt-16 text-center sm:pt-24">
        <Reveal>
          <div className="relative h-32 w-32 sm:h-36 sm:w-36">
            <Image
              src="/avatar.jpg"
              alt={profile.name}
              width={144}
              height={144}
              priority
              className="h-full w-full rounded-full object-cover shadow-2xl ring-2 ring-accent/30"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-text">
            {profile.name}
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.34}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/experience"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              View my experience
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
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
