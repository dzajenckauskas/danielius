"use client";

import { useEffect } from "react";

const FRAMES = [
  { y: 0, scaleX: 1, scaleY: 1 },
  { y: 2, scaleX: 1.14, scaleY: 0.86 },
  { y: 0, scaleX: 1.06, scaleY: 0.94 },
  { y: -5, scaleX: 0.94, scaleY: 1.08 },
  { y: -9, scaleX: 0.9, scaleY: 0.91 },
  { y: -5, scaleX: 0.97, scaleY: 1.06 },
  { y: 0, scaleX: 1, scaleY: 1 },
  { y: 2, scaleX: 1.16, scaleY: 0.84 },
  { y: -2, scaleX: 0.98, scaleY: 1.04 },
  { y: 0, scaleX: 1, scaleY: 1 },
] as const;
const BOUNCE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function AnimatedFavicon() {
  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.dataset.animatedFavicon = "true";
    document.head.appendChild(icon);

    let generation = 0;
    let frameUrls: string[] = [];
    const timers = new Set<number>();

    function clearTimers() {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    }

    function revokeFrames() {
      frameUrls.forEach((url) => URL.revokeObjectURL(url));
      frameUrls = [];
    }

    function scheduleNextBounce() {
      if (document.hidden || reducedMotion.matches) return;
      const timer = window.setTimeout(
        () => animate(BOUNCE_ORDER),
        8_000 + Math.random() * 8_000,
      );
      timers.add(timer);
    }

    function animate(order: number[]) {
      clearTimers();
      if (!frameUrls.length || reducedMotion.matches) {
        if (frameUrls[0]) icon.href = frameUrls[0];
        return;
      }
      order.forEach((frameIndex, step) => {
        const timer = window.setTimeout(() => {
          if (frameUrls[frameIndex]) icon.href = frameUrls[frameIndex];
          if (step === order.length - 1) scheduleNextBounce();
        }, step * 105);
        timers.add(timer);
      });
    }

    async function loadTheme() {
      const currentGeneration = ++generation;
      clearTimers();
      const theme = darkMode.matches ? "dark" : "light";
      try {
        const response = await fetch(`/favicon-${theme}.svg?v=6`);
        if (!response.ok) return;
        const source = await response.text();
        if (currentGeneration !== generation) return;
        revokeFrames();
        frameUrls = FRAMES.map(({ y, scaleX, scaleY }) => {
          const transform = [
            "translate(32 30)",
            `translate(0 ${y})`,
            `scale(${scaleX} ${scaleY})`,
            "translate(-32 -30)",
          ].join(" ");
          const frame = source.replace(
            '<g id="favicon-ball">',
            `<g id="favicon-ball" transform="${transform}">`,
          );
          return URL.createObjectURL(new Blob([frame], { type: "image/svg+xml" }));
        });
        icon.href = frameUrls[0];
        scheduleNextBounce();
      } catch {
        icon.href = `/favicon-${theme}.svg?v=6`;
      }
    }

    function handleVisibility() {
      clearTimers();
      if (!frameUrls.length) return;
      if (reducedMotion.matches) icon.href = frameUrls[0];
      else if (document.hidden) icon.href = frameUrls[0];
      else animate(BOUNCE_ORDER);
    }

    function handleReducedMotion() {
      clearTimers();
      if (frameUrls[0]) icon.href = frameUrls[0];
      if (!reducedMotion.matches) scheduleNextBounce();
    }

    void loadTheme();
    darkMode.addEventListener("change", loadTheme);
    reducedMotion.addEventListener("change", handleReducedMotion);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      generation += 1;
      clearTimers();
      revokeFrames();
      icon.remove();
      darkMode.removeEventListener("change", loadTheme);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
