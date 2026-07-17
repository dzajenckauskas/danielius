"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Circle,
  Eraser,
  Maximize2,
  Minimize2,
  Pencil,
  Send,
  Scaling,
  Sparkles,
  Square,
  Triangle,
  Undo2,
  X,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  DoodleFormValues,
  doodleFormSchema,
  getDoodleFormValues,
  getYupFieldErrors,
} from "@/lib/doodle-form";
import { expandImageStrokes, normalizeStrokes, PORTRAIT_IMAGE_ASPECT } from "@/lib/doodle-strokes";
import { defaultDoodle } from "@/data/defaultDoodle";
import * as yup from "yup";

type Point = { x: number; y: number };
type Tool = "pen" | "blob" | "circle" | "square" | "triangle";
type DrawingAction = {
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
  smooth?: boolean;
  closed?: boolean;
  fillColor?: string;
  rotation?: number;
  shapeSeed?: number;
  portraitBound?: boolean;
};

const COLORS = ["#3d5b57", "#b59bd7", "#8fbccc", "#d891aa", "#d2ae6c", "#191a1c"];
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 12;
const DEFAULT_WEIGHT = 2;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "pen", label: "Pen", icon: Pencil },
  { id: "blob", label: "Blob", icon: Sparkles },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "square", label: "Square", icon: Square },
  { id: "triangle", label: "Triangle", icon: Triangle },
];

const PORTRAIT_SELECTOR = "[data-doodle-portrait]";
// How strongly to lift the default doodle on tall (mobile) frames, per unit of
// (imageAspect − frameAspect). Tuned so phones lift ~0.01 (image-normalized) and
// desktop stays at 0. See defaultPortraitDoodle.
const DEFAULT_DOODLE_MOBILE_LIFT = 0.09;
// The composite and portrait-card exports are fully opaque (photo + flattened
// doodle), so JPEG compresses them far smaller than PNG without a visible
// quality loss at this size. The artwork export keeps transparency and stays PNG.
const PHOTO_EXPORT_QUALITY = 0.88;

function seededRandom(seed: number, offset: number) {
  const value = Math.sin((seed + offset) * 12_989.8) * 43_758.5453;
  return value - Math.floor(value);
}

function defaultPortraitDoodle(rect: DOMRect): DrawingAction[] {
  // Expand the portable default doodle into absolute page-pixel strokes. Its
  // points are anchored to the portrait image (not the frame), so the glasses
  // keep their aspect ratio and stay locked to the eyes on every screen size.
  const image = document.querySelector<HTMLImageElement>(`${PORTRAIT_SELECTOR} img`);
  const imageAspect = image?.naturalWidth && image?.naturalHeight
    ? image.naturalWidth / image.naturalHeight
    : PORTRAIT_IMAGE_ASPECT;
  // On tall (mobile) frames the glasses read a touch low; lift them in
  // proportion to how much taller-than-the-image the frame is. Wide desktop
  // frames (aspect >= image aspect) get zero nudge, so that placement is kept.
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

function drawAction(context: CanvasRenderingContext2D, action: DrawingAction, progress = 1) {
  const [start, ...rest] = action.points;
  if (!start) return;

  context.save();
  context.strokeStyle = action.color;
  context.fillStyle = action.color;
  context.lineWidth = action.width;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (progress < 1) {
    const openLength = action.points.slice(1).reduce((length, current, index) => {
      const previous = action.points[index];
      return length + Math.hypot(current.x - previous.x, current.y - previous.y);
    }, 0);
    const closingLength = action.closed && action.points.length > 1
      ? Math.hypot(start.x - action.points.at(-1)!.x, start.y - action.points.at(-1)!.y)
      : 0;
    const pathLength = Math.max(openLength + closingLength, 1);
    context.setLineDash([pathLength, pathLength]);
    context.lineDashOffset = pathLength * (1 - Math.max(0, progress));
  }
  context.beginPath();

  if (action.tool === "pen") {
    context.moveTo(start.x, start.y);
    if (action.points.length === 1) {
      context.lineTo(start.x + 0.1, start.y + 0.1);
    } else if (action.points.length === 2 || action.smooth === false) {
      rest.forEach((point) => context.lineTo(point.x, point.y));
    } else {
      for (let index = 1; index < action.points.length - 1; index += 1) {
        const current = action.points[index];
        const next = action.points[index + 1];
        context.quadraticCurveTo(
          current.x,
          current.y,
          (current.x + next.x) / 2,
          (current.y + next.y) / 2,
        );
      }
      const end = action.points.at(-1)!;
      context.quadraticCurveTo(end.x, end.y, end.x, end.y);
    }
    if (action.closed) context.closePath();
    if (action.fillColor) {
      context.save();
      context.fillStyle = action.fillColor;
      context.globalAlpha *= Math.max(0, Math.min(1, (progress - 0.65) / 0.35));
      context.fill();
      context.restore();
    }
    context.stroke();
    context.restore();
    return;
  }

  const end = rest.at(-1) ?? { x: start.x + 64, y: start.y + 64 };
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.max(Math.abs(end.x - start.x), 12);
  const height = Math.max(Math.abs(end.y - start.y), 12);

  if (action.tool === "blob") {
    const seed = action.shapeSeed ?? 0.5;
    const vary = (offset: number, min: number, max: number) => (
      min + seededRandom(seed, offset) * (max - min)
    );
    const pointCount = Math.floor(vary(1, 6, 11));
    const lobeCount = Math.floor(vary(2, 2, 5));
    const lobeDepth = vary(3, 0.1, 0.3);
    const phase = vary(4, 0, Math.PI * 2);
    const angleStep = (Math.PI * 2) / pointCount;
    const centerX = left + width * vary(5, 0.46, 0.54);
    const centerY = top + height * vary(6, 0.46, 0.54);
    const radiusX = width * vary(7, 0.43, 0.5);
    const radiusY = height * vary(8, 0.43, 0.5);
    const tension = vary(9, 0.72, 1.08);
    const blobPoints = Array.from({ length: pointCount }, (_, index) => {
      const baseAngle = phase + index * angleStep;
      const angle = baseAngle + vary(20 + index, -angleStep * 0.16, angleStep * 0.16);
      const lobe = Math.sin(baseAngle * lobeCount + phase) * lobeDepth;
      const radialJitter = vary(40 + index, -0.2, 0.2);
      const radius = 0.88 + lobe + radialJitter;

      return {
        x: centerX + Math.cos(angle) * radiusX * radius,
        y: centerY + Math.sin(angle) * radiusY * radius,
      };
    });

    context.globalAlpha = 0.58;
    context.moveTo(blobPoints[0].x, blobPoints[0].y);
    blobPoints.forEach((current, index) => {
      const previous = blobPoints[(index - 1 + pointCount) % pointCount];
      const next = blobPoints[(index + 1) % pointCount];
      const afterNext = blobPoints[(index + 2) % pointCount];
      const controlOne = {
        x: current.x + ((next.x - previous.x) / 6) * tension,
        y: current.y + ((next.y - previous.y) / 6) * tension,
      };
      const controlTwo = {
        x: next.x - ((afterNext.x - current.x) / 6) * tension,
        y: next.y - ((afterNext.y - current.y) / 6) * tension,
      };
      context.bezierCurveTo(
        controlOne.x,
        controlOne.y,
        controlTwo.x,
        controlTwo.y,
        next.x,
        next.y,
      );
    });
    context.closePath();
    context.fill();
  } else if (action.tool === "circle") {
    context.ellipse(left + width / 2, top + height / 2, width / 2, height / 2, action.rotation ?? -0.04, 0, Math.PI * 2);
    context.stroke();
  } else if (action.tool === "square") {
    context.roundRect(left, top, width, height, Math.min(18, width / 5, height / 5));
    context.stroke();
  } else {
    context.moveTo(left + width / 2, top);
    context.lineTo(left + width, top + height);
    context.lineTo(left, top + height);
    context.closePath();
    context.stroke();
  }
  context.restore();
}

export function DoodleLayer() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLElement>(null);
  const studioWidthRef = useRef(320);
  const studioWidthCapturedRef = useRef(false);
  const actionsRef = useRef<DrawingAction[]>([]);
  const draftRef = useRef<DrawingAction | null>(null);
  const drawingRef = useRef(false);
  const resizeFrameRef = useRef<number | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const canvasParallaxOffsetRef = useRef(0);
  const canvasPageOriginRef = useRef({ x: 0, y: 0 });
  const previousPortraitRectRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const defaultAnimationFrameRef = useRef<number | null>(null);
  const defaultAnimationProgressRef = useRef(1);
  const defaultActionCountRef = useRef(0);
  const pdfPreviewRequestedRef = useRef(false);
  const sendOpenedAtRef = useRef(0);
  const studioDragRef = useRef<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
    baseLeft: number;
    baseTop: number;
    width: number;
    height: number;
  } | null>(null);
  const [active, setActive] = useState(false);
  const [studioMinimized, setStudioMinimized] = useState(false);
  const [portraitResizeEnabled, setPortraitResizeEnabled] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [doodleSurface, setDoodleSurface] = useState<HTMLElement | null>(null);
  const [doodleAnchor, setDoodleAnchor] = useState<HTMLElement | null>(null);
  const [toolsAnchor, setToolsAnchor] = useState<HTMLElement | null>(null);
  const [studioOffset, setStudioOffset] = useState({ x: 0, y: 0 });
  const [studioPlacement, setStudioPlacement] = useState({
    left: 0,
    top: 0,
    width: 320,
    ready: false,
  });
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [weight, setWeight] = useState(DEFAULT_WEIGHT);
  const [historySize, setHistorySize] = useState(0);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof DoodleFormValues, string>>>({});

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portrait-resize-mode", {
      detail: { enabled: active && portraitResizeEnabled },
    }));
    return () => {
      window.dispatchEvent(new CustomEvent("portrait-resize-mode", {
        detail: { enabled: false },
      }));
    };
  }, [active, portraitResizeEnabled]);

  useEffect(() => {
    setToolsAnchor(document.querySelector<HTMLElement>("[data-page-tools]"));
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    const ratio = canvas.clientWidth ? canvas.width / canvas.clientWidth : 1;
    context.save();
    context.setTransform(
      ratio,
      0,
      0,
      ratio,
      -canvasPageOriginRef.current.x * ratio,
      -canvasPageOriginRef.current.y * ratio,
    );
    const defaultCount = Math.min(defaultActionCountRef.current, actionsRef.current.length);
    actionsRef.current.forEach((action, index) => {
      const actionProgress = index < defaultCount
        ? Math.max(0, Math.min(1, defaultAnimationProgressRef.current * (defaultCount + 2) - index))
        : 1;
      drawAction(context, action, actionProgress);
    });
    if (draftRef.current) drawAction(context, draftRef.current);
    context.restore();
  }, []);

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const portrait = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
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
  }, [redraw]);

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
  }, [pathname, redraw]);

  useEffect(() => {
    if (pathname !== "/") {
      studioWidthCapturedRef.current = false;
      setHeroInView(false);
      setDoodleSurface(null);
      setDoodleAnchor(null);
      setActive(false);
      return;
    }

    const hero = document.querySelector<HTMLElement>(".hero-editorial");
    const anchor = document.querySelector<HTMLElement>("[data-doodle-control-anchor]");
    setDoodleSurface(hero);
    setDoodleAnchor(anchor);
    if (anchor) {
      studioWidthRef.current = Math.min(
        anchor.getBoundingClientRect().width,
        window.innerWidth - 24,
      );
    }
    if (!hero) {
      setHeroInView(false);
      return;
    }

    const updateVisibility = (visible: boolean) => {
      setHeroInView(visible);
      if (!visible) setActive(false);
    };
    const rect = hero.getBoundingClientRect();
    updateVisibility(rect.bottom > 0 && rect.top < window.innerHeight);

    const observer = new IntersectionObserver(
      ([entry]) => updateVisibility(entry.isIntersecting),
      { rootMargin: "-30% 0px 0px", threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
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
  }, [pathname, prepareCanvas, redraw]);

  useEffect(() => {
    if (!active || !doodleAnchor) return;

    const updatePlacement = () => {
      const portrait = doodleAnchor.getBoundingClientRect();
      const studioWidth = Math.min(studioWidthRef.current, window.innerWidth - 24);

      setStudioPlacement({
        left: Math.min(
          window.innerWidth - studioWidth - 12,
          Math.max(12, portrait.left),
        ) + window.scrollX,
        top: portrait.bottom + window.scrollY + 12,
        width: studioWidth,
        ready: true,
      });
    };

    updatePlacement();
    const observer = new ResizeObserver(updatePlacement);
    observer.observe(doodleAnchor);
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("portrait-geometry-change", updatePlacement);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("portrait-geometry-change", updatePlacement);
    };
  }, [active, doodleAnchor]);

  useEffect(() => {
    if (!active && historySize === 0) return;
    prepareCanvas();
    const handleResize = () => {
      if (resizeFrameRef.current !== null) return;
      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        const defaultCount = Math.min(
          defaultActionCountRef.current,
          actionsRef.current.length,
        );
        const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);

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
        // On mobile the portrait travels the full viewport, so the original
        // heroTop-based parallax left the glasses badly off the face at most
        // scroll positions. Anchor the parallax to the portrait's distance from
        // the viewport centre instead: it reads zero when the portrait is
        // centred (glasses land on the eyes) and floats gently either side.
        const portrait = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR) ?? hero;
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
    const portrait = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
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
  }, [active, historySize, prepareCanvas, redraw]);

  useEffect(() => {
    if (!active) return;
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sendOpen) setSendOpen(false);
        else {
          setPortraitResizeEnabled(false);
          setActive(false);
        }
        return;
      }

      const isUndo = (event.metaKey || event.ctrlKey)
        && !event.shiftKey
        && event.key.toLowerCase() === "z";
      if (!isUndo || sendOpen || actionsRef.current.length === 0) return;

      event.preventDefault();
      actionsRef.current.pop();
      if (actionsRef.current.length < defaultActionCountRef.current) {
        defaultActionCountRef.current = actionsRef.current.length;
      }
      setHistorySize(actionsRef.current.length);
      redraw();
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [active, redraw, sendOpen]);

  const pointFromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    return {
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY - canvasParallaxOffsetRef.current,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = pointFromEvent(event);
    const portrait = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR)?.getBoundingClientRect();
    drawingRef.current = true;
    draftRef.current = {
      tool,
      color,
      width: weight,
      points: [point],
      shapeSeed: tool === "blob" ? Math.random() : undefined,
      portraitBound: Boolean(
        portrait
        && event.clientX >= portrait.left
        && event.clientX <= portrait.right
        && event.clientY >= portrait.top
        && event.clientY <= portrait.bottom
      ),
    };
    if (event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    redraw();
  };

  const draw = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || !draftRef.current) return;
    const next = pointFromEvent(event);
    draftRef.current.points = tool === "pen" ? [...draftRef.current.points, next] : [draftRef.current.points[0], next];
    redraw();
  };

  const finishDrawing = () => {
    if (!drawingRef.current || !draftRef.current) return;
    actionsRef.current.push(draftRef.current);
    draftRef.current = null;
    drawingRef.current = false;
    setHistorySize(actionsRef.current.length);
    redraw();
  };

  const cancelDrawing = () => {
    if (!drawingRef.current) return;
    draftRef.current = null;
    drawingRef.current = false;
    redraw();
  };

  const undo = () => {
    actionsRef.current.pop();
    if (actionsRef.current.length < defaultActionCountRef.current) {
      defaultActionCountRef.current = actionsRef.current.length;
    }
    setHistorySize(actionsRef.current.length);
    redraw();
  };

  const clear = () => {
    if (defaultAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(defaultAnimationFrameRef.current);
      defaultAnimationFrameRef.current = null;
    }
    defaultActionCountRef.current = 0;
    defaultAnimationProgressRef.current = 1;
    actionsRef.current = [];
    draftRef.current = null;
    setHistorySize(0);
    redraw();
  };

  const startStudioDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const studio = studioRef.current;
    if (!studio) return;
    const rect = studio.getBoundingClientRect();
    studioDragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: studioOffset.x,
      offsetY: studioOffset.y,
      baseLeft: rect.left - studioOffset.x,
      baseTop: rect.top - studioOffset.y,
      width: rect.width,
      height: rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveStudio = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = studioDragRef.current;
    if (!drag) return;
    const desiredX = drag.offsetX + event.clientX - drag.pointerX;
    const desiredY = drag.offsetY + event.clientY - drag.pointerY;
    const margin = 8;
    setStudioOffset({
      x: Math.min(Math.max(desiredX, margin - drag.baseLeft), window.innerWidth - margin - drag.width - drag.baseLeft),
      y: Math.min(Math.max(desiredY, margin - drag.baseTop), window.innerHeight - margin - drag.height - drag.baseTop),
    });
  };

  const finishStudioDrag = () => {
    studioDragRef.current = null;
  };

  const exportArtwork = () => {
    const actions = actionsRef.current;
    if (!actions.length) return "";

    const points = actions.flatMap((action) => {
      let actionPoints = action.points;
      if (action.tool !== "pen" && action.points.length === 1) {
        const start = action.points[0];
        actionPoints = [start, { x: start.x + 64, y: start.y + 64 }];
      }
      if (action.tool !== "blob") return actionPoints;
      const start = actionPoints[0];
      const end = actionPoints.at(-1) ?? start;
      const left = Math.min(start.x, end.x);
      const right = Math.max(start.x, end.x);
      const top = Math.min(start.y, end.y);
      const bottom = Math.max(start.y, end.y);
      const overshootX = Math.max(12, right - left) * 0.1;
      const overshootY = Math.max(12, bottom - top) * 0.1;
      return [...actionPoints, { x: left - overshootX, y: top - overshootY }, { x: right + overshootX, y: bottom + overshootY }];
    });
    const padding = 40;
    const minX = Math.min(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxX = Math.max(...points.map((point) => point.x));
    const maxY = Math.max(...points.map((point) => point.y));
    const artworkWidth = Math.max(1, maxX - minX + padding * 2);
    const artworkHeight = Math.max(1, maxY - minY + padding * 2);
    const scale = Math.min(1, 1600 / artworkWidth, 2400 / artworkHeight);
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(artworkWidth * scale));
    output.height = Math.max(1, Math.round(artworkHeight * scale));
    const context = output.getContext("2d");
    if (!context) return "";
    context.scale(scale, scale);
    context.translate(padding - minX, padding - minY);
    actions.forEach((action) => drawAction(context, action));
    return output.toDataURL("image/png");
  };

  // Serialize the drawing as portable, frame-relative vector strokes. This is
  // the doodle's true source: it can be replayed exactly (see expandStrokes)
  // and dropped into src/data/defaultDoodle.ts to become the site default.
  const exportStrokes = () => {
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
    if (!frame || !actionsRef.current.length) return [];
    const rect = frame.getBoundingClientRect();
    return normalizeStrokes(actionsRef.current, {
      pageLeft: rect.left + window.scrollX,
      pageTop: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  };

  const exportPortraitComposite = useCallback(async () => {
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
    const image = frame?.querySelector<HTMLImageElement>("img");
    if (!frame || !image) return "";
    if (!image.complete) await image.decode();

    const rect = frame.getBoundingClientRect();
    const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(rect.width * scale));
    output.height = Math.max(1, Math.round(rect.height * scale));
    const context = output.getContext("2d");
    if (!context || !image.naturalWidth || !image.naturalHeight) return "";

    context.scale(scale, scale);
    const imageScale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const imageWidth = image.naturalWidth * imageScale;
    const imageHeight = image.naturalHeight * imageScale;
    const imageX = (rect.width - imageWidth) * 0.5;
    const imageY = (rect.height - imageHeight) * 0.38;
    context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    context.save();
    context.beginPath();
    context.rect(0, 0, rect.width, rect.height);
    context.clip();
    context.translate(-(rect.left + window.scrollX), -(rect.top + window.scrollY));
    actionsRef.current.forEach((action) => drawAction(context, action));
    context.restore();

    // Signature, matching the keepsake card, so the shared JPG is branded too.
    context.save();
    context.fillStyle = "#3d5b57";
    context.font = `300 ${Math.max(11, Math.round(rect.width * 0.02))}px 'Geist Mono', monospace`;
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillText("zajenckauskas.lt ↗", rect.width - rect.width * 0.035, rect.height - rect.width * 0.045);
    context.restore();

    return output.toDataURL("image/jpeg", PHOTO_EXPORT_QUALITY);
  }, []);

  const exportPortraitCard = useCallback(async (composite: string) => {
    if (!composite) return "";
    await document.fonts.ready;
    const portrait = new window.Image();
    portrait.src = composite;
    await portrait.decode();

    // The composite already is the on-screen framed portrait with the doodle,
    // so preserve its exact framing: draw it full-bleed at its own aspect ratio
    // and layer the hero's soft blobs on top to match the live view.
    const aspect = portrait.naturalWidth && portrait.naturalHeight
      ? portrait.naturalWidth / portrait.naturalHeight
      : PORTRAIT_IMAGE_ASPECT;
    const output = document.createElement("canvas");
    output.width = 1000;
    output.height = Math.round(1000 / aspect);
    const context = output.getContext("2d");
    if (!context) return "";
    const W = output.width;
    const H = output.height;
    const blobRgba = (color: string, a: number) => {
      const hex = parseInt(color.slice(1), 16);
      return `rgba(${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}, ${a})`;
    };
    const drawSoftBlob = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
      blur: number,
      alpha: number,
      rotation = 0,
      core = 0,
    ) => {
      // Radial-gradient blob (no `context.filter = blur(...)`, which iOS Safari
      // ignores when the keepsake is exported on the visitor's phone). `core` is
      // the fraction of the radius that stays fully opaque before fading, so a
      // higher core reads as a more defined, less-blurred shape.
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const radius = halfWidth * (1.06 + blur / 260);
      context.save();
      context.translate(x + halfWidth, y + halfHeight);
      context.rotate(rotation);
      context.scale(1, halfHeight / halfWidth);
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, blobRgba(color, alpha));
      gradient.addColorStop(core, blobRgba(color, alpha));
      gradient.addColorStop(core + (1 - core) * 0.55, blobRgba(color, alpha * 0.5));
      gradient.addColorStop(1, blobRgba(color, 0));
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    context.fillStyle = "#faf9f6";
    context.fillRect(0, 0, W, H);

    // Identical framing: the composite is the framed portrait + doodle exactly
    // as seen on the site, drawn full-bleed (no re-crop).
    context.drawImage(portrait, 0, 0, W, H);

    // Atmosphere mirroring the hero blobs (same colours as globals.css).
    // Lilac: large, defined, over the lower-left edge.
    drawSoftBlob(-0.16 * W, 0.44 * H, 0.44 * W, 0.46 * H, "#b59bd7", 4, 0.66, 0.16, 0.5);
    // Blue: faint wash along the base.
    drawSoftBlob(-0.02 * W, 0.82 * H, 0.5 * W, 0.26 * H, "#8fbccc", 40, 0.26, -0.13);
    // Rose: soft accent, top-right (kept as-is).
    drawSoftBlob(0.80 * W, -0.03 * H, 0.26 * W, 0.17 * H, "#d891aa", 14, 0.42, -0.3);
    // Ochre: solid (no blur), low in the bottom-left corner.
    drawSoftBlob(0.02 * W, 0.86 * H, 0.19 * W, 0.16 * H, "#d2ae6c", 0, 0.85, 0.24, 0.82);

    // Dashed thread + ball, echoing the hero's connecting line.
    context.save();
    context.strokeStyle = "#8a938f";
    context.globalAlpha = 0.55;
    context.lineWidth = Math.max(1.2, W * 0.0018);
    context.setLineDash([W * 0.016, W * 0.016]);
    context.beginPath();
    context.moveTo(W * 0.52, H * 0.015);
    context.lineTo(W * 0.512, H * 0.9);
    context.stroke();
    context.restore();

    context.save();
    context.shadowColor = "rgba(25, 26, 28, 0.34)";
    context.shadowBlur = W * 0.018;
    context.shadowOffsetY = W * 0.005;
    const ballRadius = W * 0.014;
    const ballX = W * 0.512;
    const ballY = H * 0.9;
    const ballGradient = context.createRadialGradient(
      ballX - ballRadius * 0.3, ballY - ballRadius * 0.3, 1, ballX, ballY, ballRadius,
    );
    ballGradient.addColorStop(0, "#657a76");
    ballGradient.addColorStop(0.24, "#344945");
    ballGradient.addColorStop(1, "#17191a");
    context.fillStyle = ballGradient;
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    // The signature is already baked into the composite, so it shows through here.
    return output.toDataURL("image/jpeg", PHOTO_EXPORT_QUALITY);
  }, []);

  useEffect(() => {
    if (
      pathname !== "/"
      || historySize === 0
      || pdfPreviewRequestedRef.current
      || new URLSearchParams(window.location.search).get("doodlePdfPreview") !== "1"
    ) return;

    pdfPreviewRequestedRef.current = true;
    const generatePreview = async () => {
      try {
        const composite = await exportPortraitComposite();
        const portraitCard = await exportPortraitCard(composite);
        const response = await fetch("/api/doodles/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portraitCard }),
        });
        if (!response.ok) throw new Error("The PDF preview could not be generated.");
        const previewUrl = URL.createObjectURL(await response.blob());
        window.location.replace(previewUrl);
      } catch (error) {
        document.body.textContent = error instanceof Error
          ? error.message
          : "The PDF preview could not be generated.";
      }
    };
    void generatePreview();
  }, [exportPortraitCard, exportPortraitComposite, historySize, pathname]);

  const validateDoodleField = async (field: keyof DoodleFormValues, value: string) => {
    try {
      await doodleFormSchema.validateAt(field, { [field]: value });
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setFieldErrors((current) => ({ ...current, [field]: error.message }));
      }
    }
  };

  const sendDoodle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSendState("sending");
    setSendError("");
    const form = new FormData(event.currentTarget);
    const values = getDoodleFormValues(form);

    try {
      await doodleFormSchema.validate(values, { abortEarly: false });
      setFieldErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getYupFieldErrors(error);
        setFieldErrors(errors);
        setSendError("Please check the highlighted fields.");
        setSendState("idle");
        const firstInvalidField = Object.keys(errors)[0];
        if (firstInvalidField) {
          requestAnimationFrame(() => formElement.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus());
        }
        return;
      }
      setSendError("The form could not be validated. Please try again.");
      setSendState("error");
      return;
    }

    if (!turnstileToken) {
      setSendError("Please complete the bot check before sending.");
      setSendState("idle");
      return;
    }

    try {
      const artwork = exportArtwork();
      const composite = await exportPortraitComposite();
      const portraitCard = await exportPortraitCard(composite);
      const strokes = exportStrokes();
      const response = await fetch("/api/doodles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: form.get("website"),
          issuedAtMs: sendOpenedAtRef.current,
          turnstileToken,
          artwork,
          composite,
          portraitCard,
          strokes,
          page: window.location.href,
        }),
      });
      if (response.status === 413) {
        throw new Error("Your doodle is too large to send. Try a simpler drawing and send again.");
      }

      let result: { error?: string; fieldErrors?: Partial<Record<keyof DoodleFormValues, string>> } = {};
      try {
        result = await response.json();
      } catch {
        throw new Error("The doodle could not be sent. Please try again.");
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (!response.ok) throw new Error(result.error || "The doodle could not be sent.");
      setSendState("sent");
    } catch (error) {
      window.turnstile?.reset();
      setTurnstileToken("");
      setSendError(error instanceof Error ? error.message : "The doodle could not be sent.");
      setSendState("error");
    }
  };

  return (
    <>
      {doodleSurface && createPortal(
        <>
          <canvas
            ref={canvasRef}
            className="doodle-canvas"
            aria-label="Doodle canvas"
          />
          <div
            ref={hitAreaRef}
            className={`doodle-hit-area ${active && !portraitResizeEnabled ? "doodle-hit-area-active" : ""}`}
            aria-hidden="true"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={finishDrawing}
            onPointerCancel={cancelDrawing}
          />
        </>,
        doodleSurface,
      )}

      {active && !studioMinimized && studioPlacement.ready && (
        <aside
          ref={studioRef}
          className="doodle-studio"
          aria-label="Doodle studio"
          style={{
            left: studioPlacement.left,
            top: studioPlacement.top,
            right: "auto",
            bottom: "auto",
            width: studioPlacement.width,
            transform: `translate3d(${studioOffset.x}px, ${studioOffset.y}px, 0)`,
          }}
        >
          <div
            className="doodle-studio-heading"
            title="Drag to move"
            onPointerDown={startStudioDrag}
            onPointerMove={moveStudio}
            onPointerUp={finishStudioDrag}
            onPointerCancel={finishStudioDrag}
          >
            <strong>Doodle studio</strong>
            <div className="doodle-studio-heading-actions">
              <button type="button" className="doodle-studio-minimize" onClick={() => setStudioMinimized(true)} aria-label="Minimize doodle studio" title="Minimize studio"><Minimize2 /></button>
              <button type="button" onClick={() => { setPortraitResizeEnabled(false); setActive(false); }} aria-label="Close doodle studio and exit drawing mode" title="Exit drawing mode"><X /></button>
            </div>
          </div>

          <div className="doodle-tool-grid" aria-label="Drawing tool">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className={tool === id ? "is-selected" : ""} onClick={() => setTool(id)} aria-pressed={tool === id}>
                <Icon /><span>{label}</span>
              </button>
            ))}
          </div>

          <div className="doodle-setting-row">
            <span>Colour</span>
            <div className="doodle-swatches">
              {COLORS.map((value) => (
                <button key={value} type="button" className={color === value ? "is-selected" : ""} style={{ "--swatch": value } as React.CSSProperties} onClick={() => setColor(value)} aria-label={`Use colour ${value}`} aria-pressed={color === value} />
              ))}
            </div>
          </div>

          {tool !== "blob" && (
            <div className="doodle-setting-row">
              <label htmlFor="doodle-line-weight">Weight</label>
              <div className="doodle-weight-control">
                <input
                  id="doodle-line-weight"
                  type="range"
                  min={MIN_WEIGHT}
                  max={MAX_WEIGHT}
                  step={1}
                  value={weight}
                  onChange={(event) => setWeight(Number(event.currentTarget.value))}
                  style={{
                    "--weight-progress": `${((weight - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT)) * 100}%`,
                  } as React.CSSProperties}
                  aria-label="Line weight"
                  aria-valuetext={`${weight} pixels`}
                />
                <output htmlFor="doodle-line-weight">{weight}px</output>
              </div>
            </div>
          )}

          <div className="doodle-studio-actions">
            <button type="button" onClick={undo} disabled={!historySize}><Undo2 />Undo</button>
            <button type="button" onClick={clear} disabled={!historySize}><Eraser />Clear</button>
            <button
              type="button"
              className={`doodle-resize-button ${portraitResizeEnabled ? "is-selected" : ""}`}
              onClick={() => setPortraitResizeEnabled((enabled) => !enabled)}
              aria-pressed={portraitResizeEnabled}
              title={portraitResizeEnabled ? "Return to drawing" : "Resize portrait"}
            >
              <Scaling />
              <span>{portraitResizeEnabled ? "Done" : "Resize"}</span>
            </button>
            <button type="button" className="doodle-send-button" onClick={() => { sendOpenedAtRef.current = Date.now(); setTurnstileToken(""); setSendOpen(true); setSendState("idle"); setSendError(""); setFieldErrors({}); }} disabled={!historySize}><Send />Send it</button>
          </div>
        </aside>
      )}

      {sendOpen && (
        <div className="doodle-send-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) setSendOpen(false); }}>
          <section className="doodle-send-panel" role="dialog" aria-modal="true" aria-labelledby="doodle-send-title">
            <button type="button" className="doodle-send-close" onClick={() => setSendOpen(false)} aria-label="Close send panel"><X /></button>
            {sendState === "sent" ? (
              <div className="doodle-send-success">
                <Sparkles />
                <p className="eyebrow">Doodle delivered</p>
                <h2>That made my inbox better.</h2>
                <p>Thanks for saying hello in your own way. A keepsake PDF is on its way to your inbox, and I’ll reply to the email you shared.</p>
                <button type="button" className="primary-button" onClick={() => { setSendOpen(false); setActive(false); }}>Done</button>
              </div>
            ) : (
              <form onSubmit={sendDoodle} noValidate>
                <p className="eyebrow">Creative contact</p>
                <h2 id="doodle-send-title">Send your doodle</h2>
                <p>I’ll receive your transparent doodle and a portrait preview. Add an email so I can draw—or write—back.</p>
                <div className="doodle-form-grid">
                  <label>
                    <span>Your name</span>
                    <input name="name" maxLength={80} autoComplete="name" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "doodle-name-error" : undefined} onBlur={(event) => validateDoodleField("name", event.currentTarget.value)} onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))} />
                    {fieldErrors.name && <small id="doodle-name-error" className="doodle-field-error">{fieldErrors.name}</small>}
                  </label>
                  <label>
                    <span>Your email</span>
                    <input name="email" type="email" maxLength={160} autoComplete="email" required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "doodle-email-error" : undefined} onBlur={(event) => validateDoodleField("email", event.currentTarget.value)} onChange={() => setFieldErrors((current) => ({ ...current, email: undefined }))} />
                    {fieldErrors.email && <small id="doodle-email-error" className="doodle-field-error">{fieldErrors.email}</small>}
                  </label>
                </div>
                <label>
                  <span>A little context</span>
                  <textarea name="message" rows={3} maxLength={1000} placeholder="A project, an idea, or just hello…" required aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "doodle-message-error" : undefined} onBlur={(event) => validateDoodleField("message", event.currentTarget.value)} onChange={() => setFieldErrors((current) => ({ ...current, message: undefined }))} />
                  {fieldErrors.message && <small id="doodle-message-error" className="doodle-field-error">{fieldErrors.message}</small>}
                </label>
                <label className="doodle-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
                <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} />
                {sendError && <p className="doodle-form-error" role="alert">{sendError}</p>}
                <button type="submit" className="primary-button" disabled={sendState === "sending" || !TURNSTILE_SITE_KEY || !turnstileToken}>
                  <Send />{sendState === "sending" ? "Sending…" : "Send doodle"}
                </button>
                <small className="doodle-privacy-note">Your details are only used to reply to this message.</small>
              </form>
            )}
          </section>
        </div>
      )}

      {active && studioMinimized && toolsAnchor && createPortal(
        <button type="button" className="doodle-tool doodle-studio-restore" onClick={() => setStudioMinimized(false)} aria-label="Restore doodle studio" title="Restore doodle studio">
          <Maximize2 aria-hidden="true" />
        </button>,
        toolsAnchor,
      )}
      {heroInView && !active && doodleAnchor && createPortal(
        (
          <button type="button" onClick={() => {
            setPortraitResizeEnabled(false);
            setStudioMinimized(false);
            if (!studioWidthCapturedRef.current) {
              studioWidthRef.current = Math.min(
                doodleAnchor.getBoundingClientRect().width,
                window.innerWidth - 24,
              );
              studioWidthCapturedRef.current = true;
            }
            setStudioPlacement((current) => ({ ...current, ready: false }));
            setActive(true);
          }} className="doodle-tool doodle-tool-invite hero-doodle-invite" aria-label="Draw on my portrait" aria-pressed="false">
            <span className="doodle-tool-icon" aria-hidden="true">
              <Pencil className="h-4 w-4" />
            </span>
            <span className="doodle-tool-label">Doodle me</span>
          </button>
        ),
        doodleAnchor,
      )}
    </>
  );
}
