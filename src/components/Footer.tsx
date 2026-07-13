import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-4xl px-5 py-6 text-center text-sm text-subtle sm:text-left">
        <p>
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
