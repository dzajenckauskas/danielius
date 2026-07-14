"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileText, Github, Linkedin, Menu, X } from "lucide-react";
import { profile } from "@/data/profile";

const links = [
  // { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
];

// The dot drops from the top of the screen onto the "D", bounces with real
// physics, rolls across the letter tops (each letter bobs on contact),
// tumbles off the "S" and out of the header, then fires "nav-ball-exit" so
// the scroll-thread ball can take over.
const DOT_SIZE = 18;
const DOT_R = DOT_SIZE / 2;
const GRAVITY = 2600; // px/s²
const RESTITUTION = 0.55;
const ROLL_ACCEL = 50; // gentle imaginary downhill so the roll keeps going
const MIN_BOUNCE_SPEED = 130; // below this the ball settles into rolling
const IMPACT_DEFORMATION = 0.06; // subtle compression for a rigid ball
const DROP_DELAY_MS = 1600;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const nameRef = useRef<HTMLAnchorElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 8);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const link = nameRef.current;
    const dot = dotRef.current;
    if (!link || !dot) return;

    let raf = 0;
    const stopBall = () => {
      cancelAnimationFrame(raf);
      dot.style.opacity = "0";
    };
    window.addEventListener("scroll-ball-start", stopBall);

    const timer = window.setTimeout(async () => {
      await document.fonts?.ready;
      const shells = Array.from(link.querySelectorAll<HTMLElement>(".nav-name-letter-shell"));
      if (shells.length === 0) return;
      const h = shells[0].offsetHeight;
      const groundY = shells[0].offsetTop + h * 0.16; // cap-height line of the letters
      const nameLeft = shells[0].offsetLeft;
      const lastShell = shells[shells.length - 1];
      const nameRight = lastShell.offsetLeft + lastShell.offsetWidth;
      // The header is sticky at the top, so viewport coords are stable.
      const linkTop = link.getBoundingClientRect().top;
      const headerBottom = link.closest("header")?.getBoundingClientRect().bottom ?? 64;
      const exitY = headerBottom - linkTop;
      const centers = shells.map((shell) => shell.offsetLeft + shell.offsetWidth / 2);

      const boop = (index: number) => {
        const shell = shells[index];
        if (!shell) return;
        shell.classList.add("nav-letter-boop-on");
        window.setTimeout(() => shell.classList.remove("nav-letter-boop-on"), 460);
      };

      let cx = centers[0] - 26;
      let cy = -(linkTop + DOT_R + 2); // just above the viewport's top edge
      let vx = 85;
      let vy = 0;
      let rot = 0;
      let squash = 0;
      let grounded = false;
      let nextBoop = 0;
      let lastT = performance.now();

      const step = (now: number) => {
        const dt = Math.min((now - lastT) / 1000, 0.032);
        lastT = now;
        const overName = cx >= nameLeft - 2 && cx <= nameRight + 2;

        if (grounded) {
          vx += ROLL_ACCEL * dt;
          cx += vx * dt;
          while (nextBoop < centers.length && centers[nextBoop] <= cx) boop(nextBoop++);
          if (!overName) grounded = false; // rolled off the "S"
        } else {
          vy += GRAVITY * dt;
          cx += vx * dt;
          cy += vy * dt;
          if (overName && vy > 0 && cy + DOT_R >= groundY) {
            cy = groundY - DOT_R;
            while (nextBoop < centers.length && centers[nextBoop] < cx - DOT_R * 2) nextBoop++;
            if (nextBoop < centers.length && Math.abs(centers[nextBoop] - cx) < 14) boop(nextBoop++);
            if (Math.abs(vy) > MIN_BOUNCE_SPEED) {
              vy = -vy * RESTITUTION;
              vx *= 0.99;
              squash = 0.5;
            } else {
              vy = 0;
              grounded = true;
              squash = 0.3;
            }
          }
        }
        rot += (vx / DOT_R) * dt * (180 / Math.PI); // roll without slipping
        squash *= Math.exp(-dt * 12);

        const opacity = Math.max(0, Math.min(1, 1 - (cy - exitY) / 26));
        dot.style.opacity = opacity.toFixed(2);
        dot.style.transform =
          `translate(${(cx - DOT_R).toFixed(1)}px, ${(cy - DOT_R).toFixed(1)}px)`
          + ` rotate(${rot.toFixed(1)}deg)`
          + ` scale(${(1 + squash * IMPACT_DEFORMATION).toFixed(3)}, ${(1 - squash * IMPACT_DEFORMATION).toFixed(3)})`;

        if (opacity <= 0) {
          window.dispatchEvent(new Event("nav-ball-exit"));
          return;
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, DROP_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll-ball-start", stopBall);
      stopBall();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isScrolled || open
          ? "border-border/60 bg-bg/20 backdrop-blur-sm md:backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          ref={nameRef}
          className="nav-name relative"
          aria-label={`${profile.firstName} — Home`}
        >
          {Array.from(profile.firstName.toUpperCase()).map((letter, index) => {
            const order = [5, 1, 8, 3, 0, 7, 2, 6, 4][index];
            const animationType = ["hop", "tilt", "nudge", "squash"][(index * 7 + 3) % 4];
            return (
              <span
                key={`${letter}-${index}`}
                className="nav-name-letter-shell"
                style={{ "--nav-enter-delay": `${0.08 + index * 0.045}s` } as React.CSSProperties}
                aria-hidden="true"
              >
                <span
                  className={`nav-name-letter hero-letter-${animationType}`}
                  style={{ "--nav-letter-delay": `${2.4 + order * 0.55}s` } as React.CSSProperties}
                >
                  {letter}
                </span>
              </span>
            );
          })}
          <span ref={dotRef} className="nav-dot" aria-hidden="true" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className={`nav-link ${pathname.startsWith(l.href) ? "nav-link-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
          )}
          <a
            href="/api/resume"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View CV"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <FileText className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="ml-1 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1b1b1b] px-5 text-xs font-semibold text-white transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-black hover:shadow-lg dark:bg-[#f2f0ec] dark:text-[#191a1c] dark:hover:bg-white"
          >
            Let&apos;s talk
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="bg-transparent px-5 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className={`nav-link ${pathname.startsWith(l.href) ? "nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-1 border-t border-border/60 pt-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <Github className="h-[18px] w-[18px]" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <Linkedin className="h-[18px] w-[18px]" />
              </a>
              <a
                href="/api/resume"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="View CV"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <FileText className="h-[18px] w-[18px]" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1b1b1b] px-4 text-xs font-semibold text-white transition-colors hover:bg-black dark:bg-[#f2f0ec] dark:text-[#191a1c] dark:hover:bg-white"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
