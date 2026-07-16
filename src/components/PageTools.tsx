"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

// Always mounted (unlike the doodle studio, which only loads on the
// homepage) so the theme toggle stays available on every route. The doodle
// studio's minimize/restore button portals into this same container by
// querying [data-page-tools] when it needs to appear alongside it.
export function PageTools() {
  return (
    <div className="doodle-tools" aria-label="Page tools" data-page-tools>
      <ThemeToggle />
    </div>
  );
}
