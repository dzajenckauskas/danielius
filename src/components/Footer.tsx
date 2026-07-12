import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-5 py-6 text-sm text-subtle sm:flex-row">
        <p>
          © {year} {profile.name}
        </p>
        <p>
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted transition-colors hover:text-accent"
          >
            Next.js
          </a>{" "}
          &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
