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
  // An intentionally uneven gesture rather than a geometric ellipse. Unequal
  // lobes, a tilted axis and an off-centre return create a loose hand motion.
  const lean = (character - 0.5) * radius * 0.5;
  const horizontal = radius * (0.82 + character * 0.3);
  const vertical = radius * (0.62 + (1 - character) * 0.28);
  const x = center.x;
  const y = center.y;
  const startX = x - radius * (0.94 + character * 0.1);
  const startY = y;

  return path
    + ` C ${x - horizontal * 1.08} ${y + vertical * 0.48}, ${x - horizontal * 0.42 + lean} ${y + vertical * 1.08}, ${x + horizontal * 0.12 + lean} ${y + vertical * 0.86}`
    + ` C ${x + horizontal * 0.72} ${y + vertical * 0.7}, ${x + horizontal * 1.06} ${y + vertical * 0.12}, ${x + horizontal * 0.82} ${y - vertical * 0.34}`
    + ` C ${x + horizontal * 0.58 - lean} ${y - vertical * 0.94}, ${x - horizontal * 0.12 - lean} ${y - vertical * 1.02}, ${x - horizontal * 0.66} ${y - vertical * 0.62}`
    + ` C ${x - horizontal * 1.04} ${y - vertical * 0.38}, ${x - horizontal * 1.12} ${y + vertical * 0.02}, ${startX} ${startY}`;
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
  const variationRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const interactionRef = useRef(0);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const pathname = usePathname();

  const measure = useCallback(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const pageShell = document.querySelector<HTMLElement>("[data-page-shell]");
    if (!svg || !path || !pageShell) return;

    // Measure only real page content. document.scrollHeight also includes this
    // absolute SVG, which would allow the thread to make itself taller forever.
    const shellRect = pageShell.getBoundingClientRect();
    const footer = pageShell.querySelector<HTMLElement>("footer");
    const footerRect = footer?.getBoundingClientRect();
    const shellTop = shellRect.top + window.scrollY;
    const documentHeight = Math.max(
      Math.ceil(shellRect.bottom + window.scrollY),
      Math.ceil(shellTop + pageShell.scrollHeight),
      footerRect ? Math.ceil(footerRect.bottom + window.scrollY) : 0,
      window.innerHeight,
    );
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-thread-anchor]"));
    if (variationRef.current.length === 0) {
      variationRef.current = Array.from({ length: 64 }, () => 0.08 + Math.random() * 0.84);
      turbulenceRef.current?.setAttribute("seed", `${Math.floor(Math.random() * 900) + 100}`);
      turbulenceRef.current?.setAttribute(
        "baseFrequency",
        `${(0.004 + Math.random() * 0.004).toFixed(4)} ${(0.014 + Math.random() * 0.01).toFixed(4)}`,
      );
    }
    const variation = variationRef.current;
    const randomAt = (index: number) => variation[index % variation.length] ?? 0.5;
    const points: Point[] = [{ x: 700 + randomAt(0) * 210, y: 0 }];

    anchors.forEach((anchor, index) => {
      const rect = anchor.getBoundingClientRect();
      const explicitX = Number(anchor.dataset.threadX);
      const isEndAnchor = anchor.dataset.threadEnd === "true";
      const hasExplicitLoops = anchor.dataset.threadLoops !== undefined;
      const generatedLoop = !isEndAnchor && randomAt(index * 5 + 17) > 0.86 ? 1 : undefined;
      const loops = hasExplicitLoops
        ? Number(anchor.dataset.threadLoops)
        : generatedLoop;
      const radius = Number(anchor.dataset.threadRadius || 0);
      const normallyRight = index % 2 === 0;
      const flipSide = randomAt(index * 3 + 9) > 0.72;
      const useRightSide = flipSide ? !normallyRight : normallyRight;
      const generatedX = useRightSide
        ? 710 + randomAt(index * 4 + 21) * 190
        : 90 + randomAt(index * 4 + 21) * 200;
      const anchorX = Number.isFinite(explicitX) && explicitX > 0
        ? Math.max(70, Math.min(930, explicitX + (randomAt(index + 31) - 0.5) * 64))
        : generatedX;
      points.push({
        x: anchorX,
        y: Math.round(
          rect.top
          + window.scrollY
          + (isEndAnchor
            ? rect.height / 2
            : anchor.dataset.threadCenter === "true"
              ? rect.height / 2
              : Math.min(rect.height * (0.12 + randomAt(index + 41) * 0.14), 110)),
        ),
        loops,
        radius: radius || (loops ? 28 + randomAt(index * 2 + 27) * 44 : undefined),
      });
    });
    points.push({
      x: 120 + randomAt(anchors.length * 3 + 5) * 760,
      y: Math.max(documentHeight - 1, 0),
    });

    svg.setAttribute("viewBox", `0 0 1000 ${documentHeight}`);
    svg.style.height = `${documentHeight}px`;
    const pathData = buildPath(points, variation);
    path.setAttribute("d", pathData);
  }, []);

  const update = useCallback(() => {
    frameRef.current = null;
    const path = pathRef.current;
    if (!path) return;

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
    if (interactionRef.current > 0.015) {
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

    measure();
    update();
    const pageShell = document.querySelector<HTMLElement>("[data-page-shell]");
    if (pageShell) resizeObserver.observe(pageShell);
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
