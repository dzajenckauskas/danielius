import { FileUser, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

type SocialLinksProps = {
  className?: string;
  includeEmail?: boolean;
};

const iconClassName = "h-[18px] w-[18px]";
const linkClassName = "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text";

export function SocialLinks({ className = "flex items-center gap-1", includeEmail = false }: SocialLinksProps) {
  const links = [
    { href: profile.github, label: "GitHub", icon: Github, external: true },
    { href: profile.linkedin, label: "LinkedIn", icon: Linkedin, external: true },
    { href: "/api/resume", label: "View CV", icon: FileUser, external: true },
    ...(includeEmail
      ? [{ href: `mailto:${profile.email}`, label: "Email", icon: Mail, external: false }]
      : []),
  ];

  return (
    <div className={className}>
      {links.map(({ href, label, icon: Icon, external }) => (
        <a
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          aria-label={label}
          className={linkClassName}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
