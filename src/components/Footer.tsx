import Link from "next/link";
import { profile } from "@/data/profile";
import { SocialLinks } from "@/components/SocialLinks";

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

        <SocialLinks includeEmail />
      </div>
    </footer>
  );
}
