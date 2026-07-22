"use client";

import dynamic from "next/dynamic";

// Client-only enhancements that add nothing to the server-rendered markup:
// the ambient favicon animation, the scroll progress bar, the scroll thread,
// the floating page tools, and the doodle studio gate. Loading them with
// next/dynamic + ssr:false (allowed here because this is a Client Component)
// code-splits each into its own chunk and keeps their JS off the initial
// hydration critical path, which is the biggest lever on mobile Total Blocking
// Time. They are all fixed/absolute overlays (or render null), so grouping and
// deferring them has no effect on layout.
const AnimatedFavicon = dynamic(
  () => import("./AnimatedFavicon").then((m) => m.AnimatedFavicon),
  { ssr: false },
);
const ScrollProgress = dynamic(
  () => import("./ScrollProgress").then((m) => m.ScrollProgress),
  { ssr: false },
);
const ScrollThread = dynamic(
  () => import("./ScrollThread").then((m) => m.ScrollThread),
  { ssr: false },
);
const PageTools = dynamic(
  () => import("./PageTools").then((m) => m.PageTools),
  { ssr: false },
);
const DoodleStudioGate = dynamic(
  () => import("./DoodleStudioGate").then((m) => m.DoodleStudioGate),
  { ssr: false },
);

export function DeferredEnhancements() {
  return (
    <>
      <AnimatedFavicon />
      <ScrollProgress />
      <ScrollThread />
      <PageTools />
      <DoodleStudioGate />
    </>
  );
}
