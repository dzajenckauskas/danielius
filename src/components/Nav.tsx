"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Github, Mail, Linkedin, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { profile } from "@/data/profile";

const links = [
  // { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
        <Link
          href="/"
          className="nav-name"
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
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`nav-link ${pathname === l.href ? "nav-link-active" : ""}`}
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
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
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <Mail className="h-[18px] w-[18px]" />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
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
        <div className="border-t border-border/60 bg-bg/95 px-5 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`nav-link ${pathname === l.href ? "nav-link-active" : ""}`}
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
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
