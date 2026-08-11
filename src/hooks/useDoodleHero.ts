"use client";

import { useEffect, useState } from "react";
import {
  defaultPortraitDoodle,
  DOODLE_PORTRAIT_SELECTOR,
} from "@/hooks/useDoodleCanvas";
import type { DrawingAction } from "@/lib/doodle-canvas";

type MutableRef<T> = { current: T };

type DoodleHeroOptions = {
  pathname: string;
  actionsRef: MutableRef<DrawingAction[]>;
  defaultActionCountRef: MutableRef<number>;
  defaultAnimationFrameRef: MutableRef<number | null>;
  defaultAnimationProgressRef: MutableRef<number>;
  prepareCanvas: () => void;
  redraw: () => void;
  setHistorySize: (size: number) => void;
  deactivate: () => void;
};

export function useDoodleHero({
  pathname,
  actionsRef,
  defaultActionCountRef,
  defaultAnimationFrameRef,
  defaultAnimationProgressRef,
  prepareCanvas,
  redraw,
  setHistorySize,
  deactivate,
}: DoodleHeroOptions) {
  const [heroInView, setHeroInView] = useState(false);
  const [doodleSurface, setDoodleSurface] = useState<HTMLElement | null>(null);
  const [doodleAnchor, setDoodleAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname === "/") return;
    const defaultCount = Math.min(
      defaultActionCountRef.current,
      actionsRef.current.length,
    );
    if (defaultCount === 0) return;

    if (defaultAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(defaultAnimationFrameRef.current);
      defaultAnimationFrameRef.current = null;
    }
    actionsRef.current = actionsRef.current.slice(defaultCount);
    defaultActionCountRef.current = 0;
    defaultAnimationProgressRef.current = 1;
    setHistorySize(actionsRef.current.length);
    redraw();
  }, [
    actionsRef,
    defaultActionCountRef,
    defaultAnimationFrameRef,
    defaultAnimationProgressRef,
    pathname,
    redraw,
    setHistorySize,
  ]);

  useEffect(() => {
    if (pathname !== "/") {
      setHeroInView(false);
      setDoodleSurface(null);
      setDoodleAnchor(null);
      deactivate();
      return;
    }

    const hero = document.querySelector<HTMLElement>(".hero-editorial");
    const anchor = document.querySelector<HTMLElement>("[data-doodle-control-anchor]");
    setDoodleSurface(hero);
    setDoodleAnchor(anchor);
    if (!hero) {
      setHeroInView(false);
      return;
    }

    const updateVisibility = (visible: boolean) => {
      setHeroInView(visible);
      if (!visible) deactivate();
    };
    const rect = hero.getBoundingClientRect();
    updateVisibility(rect.bottom > 0 && rect.top < window.innerHeight);

    const observer = new IntersectionObserver(
      ([entry]) => updateVisibility(entry.isIntersecting),
      { rootMargin: "-30% 0px 0px", threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [deactivate, pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const frame = document.querySelector<HTMLElement>(DOODLE_PORTRAIT_SELECTOR);
    if (!frame || defaultActionCountRef.current > 0) return;
    let seeded = false;
    const seedDoodle = () => {
      if (seeded || defaultActionCountRef.current > 0) return;
      seeded = true;
      const defaults = defaultPortraitDoodle(frame.getBoundingClientRect());
      actionsRef.current = [...defaults, ...actionsRef.current];
      defaultActionCountRef.current = defaults.length;
      defaultAnimationProgressRef.current = 0;
      setHistorySize(actionsRef.current.length);
      prepareCanvas();
      const shouldAnimate = window.innerWidth > 900
        && !window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches;
      if (!shouldAnimate) {
        defaultAnimationProgressRef.current = 1;
        redraw();
        return;
      }
      const startedAt = performance.now();
      const animateDoodle = (time: number) => {
        defaultAnimationProgressRef.current = Math.min(1, (time - startedAt) / 1_800);
        redraw();
        if (defaultAnimationProgressRef.current < 1) {
          defaultAnimationFrameRef.current = window.requestAnimationFrame(animateDoodle);
        } else {
          defaultAnimationFrameRef.current = null;
        }
      };
      defaultAnimationFrameRef.current = window.requestAnimationFrame(animateDoodle);
    };
    const reveal = frame.closest<HTMLElement>(".reveal");
    if (!reveal || getComputedStyle(reveal).animationName === "none") {
      seedDoodle();
      return;
    }
    reveal.addEventListener("animationend", seedDoodle, { once: true });
    const fallback = window.setTimeout(seedDoodle, 1_000);
    return () => {
      reveal.removeEventListener("animationend", seedDoodle);
      window.clearTimeout(fallback);
      if (defaultAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(defaultAnimationFrameRef.current);
        defaultAnimationFrameRef.current = null;
      }
    };
  }, [
    actionsRef,
    defaultActionCountRef,
    defaultAnimationFrameRef,
    defaultAnimationProgressRef,
    pathname,
    prepareCanvas,
    redraw,
    setHistorySize,
  ]);

  return { heroInView, doodleSurface, doodleAnchor };
}
