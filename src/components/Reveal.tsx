import type { ReactNode } from "react";

/**
 * Entrance-animation wrapper. Pure CSS (see `.reveal` in globals.css) — the
 * content fades/slides up on load and always ends visible, so there's no
 * dependency on JS or IntersectionObserver. `delay` staggers grouped items.
 */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`reveal ${className ?? ""}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
