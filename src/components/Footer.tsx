import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

const quickLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t border-border/60"
      data-thread-anchor
      data-thread-end="true"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-subtle">
          © {year} {profile.name}
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
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
            aria-label="Email"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <Mail className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
