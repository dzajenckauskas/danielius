"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { defaultDoodle } from "@/data/defaultDoodle";
import type { DrawingAction } from "@/lib/doodle-canvas";
import { expandImageStrokes, PORTRAIT_IMAGE_ASPECT } from "@/lib/doodle-strokes";

export const DOODLE_PORTRAIT_SELECTOR = "[data-doodle-portrait]";
const DEFAULT_DOODLE_MOBILE_LIFT = 0.09;

type MutableRef<T> = { current: T };

export function defaultPortraitDoodle(rect: DOMRect): DrawingAction[] {
  const image = document.querySelector<HTMLImageElement>(`${DOODLE_PORTRAIT_SELECTOR} img`);
  const imageAspect = image?.naturalWidth && image?.naturalHeight
    ? image.naturalWidth / image.naturalHeight
    : PORTRAIT_IMAGE_ASPECT;
  const frameAspect = rect.height ? rect.width / rect.height : imageAspect;
  const verticalNudge = Math.min(
    0.045,
    Math.max(0, imageAspect - frameAspect) * DEFAULT_DOODLE_MOBILE_LIFT,
  );
  return expandImageStrokes(defaultDoodle, {
    pageLeft: rect.left + window.scrollX,
    pageTop: rect.top + window.scrollY,
    frameWidth: rect.width,
    frameHeight: rect.height,
    imageAspect,
    verticalNudge,
  });
}

type DoodleCanvasOptions = {
  active: boolean;
  historySize: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  hitAreaRef: RefObject<HTMLDivElement | null>;
  actionsRef: MutableRef<DrawingAction[]>;
  canvasParallaxOffsetRef: MutableRef<number>;
  canvasPageOriginRef: MutableRef<{ x: number; y: number }>;
  defaultActionCountRef: MutableRef<number>;
  redraw: () => void;
};

export function useDoodleCanvas({
  active,
  historySize,
  canvasRef,
  hitAreaRef,
  actionsRef,
  canvasParallaxOffsetRef,
  canvasPageOriginRef,
  defaultActionCountRef,
  redraw,
}: DoodleCanvasOptions) {
  const resizeFrameRef = useRef<number | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const previousPortraitRectRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const portrait = document.querySelector<HTMLElement>(DOODLE_PORTRAIT_SELECTOR);
    const surface = document.querySelector<HTMLElement>(".hero-editorial");
    if (!canvas || !portrait || !surface) return;
    const portraitRect = portrait.getBoundingClientRect();
    const rect = surface.getBoundingClientRect();
    const hitArea = hitAreaRef.current;
    if (hitArea) {
      hitArea.style.left = `${portraitRect.left - rect.left}px`;
      hitArea.style.top = `${portraitRect.top - rect.top}px`;
      hitArea.style.width = `${portraitRect.width}px`;
      hitArea.style.height = `${portraitRect.height}px`;
    }
    const pageLeft = rect.left + window.scrollX;
    const pageTop = rect.top + window.scrollY;
    if (!previousPortraitRectRef.current) {
      previousPortraitRectRef.current = {
        left: portraitRect.left + window.scrollX,
        top: portraitRect.top + window.scrollY,
        width: portraitRect.width,
        height: portraitRect.height,
      };
    }
    const isMobile = window.innerWidth <= 900
      || window.matchMedia("(pointer: coarse)").matches;
    const maxRatio = isMobile ? 1.5 : 2;
    const ratio = Math.max(Math.min(window.devicePixelRatio || 1, maxRatio), 1);
    canvasPageOriginRef.current = { x: pageLeft, y: pageTop };
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
    redraw();
  }, [canvasPageOriginRef, canvasRef, hitAreaRef, redraw]);

  useEffect(() => {
    if (!active && historySize === 0) return;
    prepareCanvas();
    const handleResize = () => {
      if (resizeFrameRef.current !== null) return;
      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        const defaultCount = Math.min(defaultActionCountRef.current, actionsRef.current.length);
        const frame = document.querySelector<HTMLElement>(DOODLE_PORTRAIT_SELECTOR);

        if (frame) {
          const rect = frame.getBoundingClientRect();
          const nextRect = {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
          };
          const previousRect = previousPortraitRectRef.current;
          let userActions = actionsRef.current.slice(defaultCount);

          if (previousRect && userActions.length > 0) {
            const scaleX = nextRect.width / Math.max(previousRect.width, 1);
            const scaleY = nextRect.height / Math.max(previousRect.height, 1);
            userActions = userActions.map((action) => action.portraitBound ? {
              ...action,
              width: action.width * Math.sqrt(scaleX * scaleY),
              points: action.points.map((point) => ({
                x: nextRect.left + ((point.x - previousRect.left) / Math.max(previousRect.width, 1)) * nextRect.width,
                y: nextRect.top + ((point.y - previousRect.top) / Math.max(previousRect.height, 1)) * nextRect.height,
              })),
            } : action);
          }

          const remappedDefaults = defaultCount > 0
            ? defaultPortraitDoodle(rect).slice(0, defaultCount)
            : [];
          actionsRef.current = [...remappedDefaults, ...userActions];
          defaultActionCountRef.current = remappedDefaults.length;
          previousPortraitRectRef.current = nextRect;
        }

        prepareCanvas();
      });
    };
    const updateParallax = () => {
      const canvas = canvasRef.current;
      const hero = document.querySelector<HTMLElement>(".hero-editorial");
      if (!canvas || !hero) return;
      const isMobile = window.innerWidth <= 900
        || window.matchMedia("(pointer: coarse)").matches;
      let offset: number;
      if (isMobile) {
        const portrait = document.querySelector<HTMLElement>(DOODLE_PORTRAIT_SELECTOR) ?? hero;
        const rect = portrait.getBoundingClientRect();
        const distanceFromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
        offset = Math.max(-14, Math.min(14, distanceFromCentre * 0.05));
      } else {
        const heroTop = hero.getBoundingClientRect().top + window.scrollY;
        const relativeScroll = window.scrollY - heroTop;
        offset = Math.max(-12, Math.min(40, relativeScroll * 0.045));
      }
      canvasParallaxOffsetRef.current = offset;
      canvas.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const handleScroll = () => {
      if (parallaxFrameRef.current !== null) return;
      parallaxFrameRef.current = window.requestAnimationFrame(() => {
        parallaxFrameRef.current = null;
        updateParallax();
      });
    };
    updateParallax();
    window.addEventListener("resize", handleResize);
    window.addEventListener("portrait-geometry-change", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    const portrait = document.querySelector<HTMLElement>(DOODLE_PORTRAIT_SELECTOR);
    const portraitResizeObserver = portrait ? new ResizeObserver(handleResize) : null;
    if (portrait && portraitResizeObserver) portraitResizeObserver.observe(portrait);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("portrait-geometry-change", handleResize);
      window.removeEventListener("scroll", handleScroll);
      portraitResizeObserver?.disconnect();
      if (resizeFrameRef.current !== null) window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
      if (parallaxFrameRef.current !== null) window.cancelAnimationFrame(parallaxFrameRef.current);
      parallaxFrameRef.current = null;
    };
  }, [
    actionsRef,
    active,
    canvasParallaxOffsetRef,
    canvasRef,
    defaultActionCountRef,
    historySize,
    prepareCanvas,
  ]);

  return { prepareCanvas };
}
