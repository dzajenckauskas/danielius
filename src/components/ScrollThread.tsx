"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Point = { x: number; y: number; loops?: number; radius?: number };

function connect(path: string, from: Point, to: Point, character: number) {
  const distance = Math.max(to.y - from.y, 80);
  const sway = (character - 0.5) * 32;
  return `${path} C ${from.x + sway} ${from.y + distance * 0.34}, `
    + `${to.x - sway * 0.35} ${to.y - distance * 0.24}, ${to.x} ${to.y}`;
}

function addOrbit(path: string, center: Point, radius: number, character: number) {
  // Four continuous cubic curves produce a softly imperfect, hand-drawn orbit.
  // Starting at the left edge gives both the incoming and outgoing line the
  // same downward tangent, so the join never pinches into a sharp point.
  const k = 0.5522848;
  const horizontal = radius * (0.94 + character * 0.1);
  const vertical = radius * (0.76 + character * 0.08);
  const x = center.x;
  const y = center.y;

  return path
    + ` C ${x - horizontal} ${y + vertical * k}, ${x - horizontal * k} ${y + vertical}, ${x} ${y + vertical}`
    + ` C ${x + horizontal * k} ${y + vertical}, ${x + horizontal} ${y + vertical * k}, ${x + horizontal} ${y}`
    + ` C ${x + horizontal} ${y - vertical * k}, ${x + horizontal * k} ${y - vertical}, ${x} ${y - vertical}`
    + ` C ${x - horizontal * k} ${y - vertical}, ${x - horizontal} ${y - vertical * k}, ${x - horizontal} ${y}`;
}

function buildPath(points: Point[], variation: number[]) {
  if (points.length < 2) return "";
  let current = points[0];
  let path = `M ${current.x} ${current.y}`;

  points.slice(1).forEach((point, index) => {
    const character = variation[index % variation.length] ?? 0.5;
    const loopCount = point.loops ?? 0;

    if (loopCount > 0) {
      const radius = point.radius ?? 42;
      const orbitStart = { x: point.x - radius * (0.94 + character * 0.1), y: point.y };
      path = connect(path, current, orbitStart, character);

      for (let loop = 0; loop < loopCount; loop += 1) {
        path = addOrbit(path, point, radius + loop * 8, character);
      }
      current = orbitStart;
      return;
    }

    path = connect(path, current, point, character);
    current = point;
  });

  return path;
}

export function ScrollThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const frameRef = useRef<number | null>(null);
  const introStartedRef = useRef(0);
  const variationRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const interactionRef = useRef(0);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const pathname = usePathname();

  const measure = useCallback(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const documentHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-thread-anchor]"));
    if (variationRef.current.length === 0) {
      variationRef.current = Array.from({ length: 18 }, () => 0.18 + Math.random() * 0.64);
      turbulenceRef.current?.setAttribute("seed", `${Math.floor(Math.random() * 900) + 100}`);
    }
    const variation = variationRef.current;
    const xPattern = [820, 835, 860, 145, 120, 845, 820, 155].map((x, index) => {
      const direction = x > 500 ? -1 : 1;
      return x + direction * variation[index % variation.length] * 48;
    });
    const points: Point[] = [{ x: 820, y: 0 }];

    anchors.forEach((anchor, index) => {
      const rect = anchor.getBoundingClientRect();
      const explicitX = Number(anchor.dataset.threadX);
      const loops = anchor.dataset.threadLoops
        ? Number(anchor.dataset.threadLoops)
        : undefined;
      const radius = Number(anchor.dataset.threadRadius || 0);
      points.push({
        x: Number.isFinite(explicitX) && explicitX > 0
          ? explicitX
          : xPattern[(index + 1) % xPattern.length],
        y: Math.round(
          rect.top
          + window.scrollY
          + (anchor.dataset.threadCenter === "true" ? rect.height / 2 : Math.min(rect.height * 0.18, 90)),
        ),
        loops,
        radius: radius || undefined,
      });
    });
    points.push({ x: xPattern[(anchors.length + 1) % xPattern.length], y: documentHeight - 40 });

    svg.setAttribute("viewBox", `0 0 1000 ${documentHeight}`);
    svg.style.height = `${documentHeight}px`;
    path.setAttribute("d", buildPath(points, variation));

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.dataset.length = `${length}`;
  }, []);

  const update = useCallback(() => {
    frameRef.current = null;
    const path = pathRef.current;
    if (!path) return;
    const length = Number(path.dataset.length || 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }
    const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
    const introElapsed = performance.now() - introStartedRef.current;
    const introProgress = Math.min(0.42, (introElapsed / 1800) * 0.42);
    const scrollDrawProgress = 0.1 + Math.sqrt(progress) * 0.9;
    const visibleProgress = Math.max(introProgress, scrollDrawProgress);
    path.style.strokeDashoffset = `${length * (1 - visibleProgress)}`;

    const svg = svgRef.current;
    if (svg) {
      svg.style.translate = `${(pointerRef.current.x * 4).toFixed(2)}px ${(pointerRef.current.y * 3).toFixed(2)}px`;
    }
    if (displacementRef.current) {
      displacementRef.current.setAttribute("scale", `${(0.25 + interactionRef.current * 1.1).toFixed(2)}`);
    }

    document.querySelectorAll<HTMLElement>(".parallax-blob").forEach((blob, index) => {
      const rect = blob.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
      const depthPattern = [0.55, 1.15, 0.8, 1.35, 0.65, 1, 0.72];
      const depth = depthPattern[index % depthPattern.length];
      const shiftY = Math.max(-34, Math.min(34, distance * -0.04 * depth));
      const shiftX = Math.sin((window.scrollY + index * 170) / 420) * 10 * depth;
      const rotation = Math.max(-4.5, Math.min(4.5, distance * -0.0032 * depth));
      blob.style.setProperty("--parallax-x", `${shiftX.toFixed(2)}px`);
      blob.style.setProperty("--parallax-y", `${shiftY.toFixed(2)}px`);
      blob.style.setProperty("--parallax-rotate", `${rotation.toFixed(2)}deg`);
    });
    interactionRef.current *= 0.9;
    if (introElapsed < 1800 || interactionRef.current > 0.015) {
      frameRef.current = requestAnimationFrame(update);
    }
  }, []);

  useEffect(() => {
    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };
    const onScroll = () => {
      interactionRef.current = Math.min(1, interactionRef.current + 0.22);
      schedule();
    };
    const onPointerMove = (event: PointerEvent) => {
      const nextX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const nextY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      const movement = Math.hypot(event.movementX, event.movementY);
      pointerRef.current = { x: nextX, y: nextY };
      interactionRef.current = Math.min(1, interactionRef.current + movement / 90);
      schedule();
    };
    const resizeObserver = new ResizeObserver(() => {
      measure();
      schedule();
    });

    introStartedRef.current = performance.now();
    measure();
    update();
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", measure);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [measure, pathname, update]);

  return (
    <svg ref={svgRef} className="scroll-thread" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <filter id="living-thread" x="-12%" y="-4%" width="124%" height="108%">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.006 0.018"
            numOctaves="2"
            seed="417"
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="0.45"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <path
        ref={pathRef}
        className="scroll-thread-path"
        fill="none"
        vectorEffect="non-scaling-stroke"
        filter="url(#living-thread)"
      />
    </svg>
  );
}
