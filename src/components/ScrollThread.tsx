"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  buildScrollThreadPath,
  type ScrollThreadPoint,
} from "@/lib/scroll-thread-path";
import { extendScrollThreadDashPattern } from "@/lib/scroll-thread-dashes";

// The nav ball fires "nav-ball-exit" when it tumbles out of the header; the
// thread ball takes over here, riding the tip of the thread and drawing it
// as the page scrolls. The timeout is a fallback in case the nav sim never
// runs (e.g. the logo failed to mount).
const BALL_HANDOFF_FALLBACK_MS = 9000;
const BALL_CATCHUP_MS = 1400;
const SAMPLE_STEP = 8;
const BALL_R = 9;

const SAMPLE_STEP_LOW_POWER = 14;

// The trace records how you scrolled: a slow ball presses down and draws a
// solid line; a fast one skims and leaves spaced skip-marks. Gap size scales
// with drawing speed (path px/s, smoothed) between these two thresholds.
function useScrollThreadRuntime() {
  const runtimeRef = useRef<{
    svgRef: { current: SVGSVGElement | null };
    pathRef: { current: SVGPathElement | null };
    turbulenceRef: { current: SVGFETurbulenceElement | null };
    displacementRef: { current: SVGFEDisplacementMapElement | null };
    ballRef: { current: HTMLDivElement | null };
    maskRef: { current: SVGMaskElement | null };
    maskPathRef: { current: SVGPathElement | null };
    frameRef: { current: number | null };
    variationRef: { current: number[] };
    pointerRef: { current: { x: number; y: number } };
    interactionRef: { current: number };
    samplesRef: { current: { x: number; y: number }[] };
    totalRef: { current: number };
    ballModeRef: { current: "hidden" | "catchup" | "live" };
    drawnRef: { current: number };
    reducedMotionRef: { current: boolean };
    patternRef: { current: number[] };
    patternLenRef: { current: number };
    speedRef: { current: number };
    lastDrawnRef: { current: number };
    lastTimeRef: { current: number };
    lastAppliedDrawnRef: { current: number };
    geometryRef: { current: { width: number; height: number } };
    blobsRef: { current: HTMLElement[] };
    lowPowerRef: { current: boolean };
    stepRef: { current: number };
    measuredRef: { current: boolean };
  } | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = {
      svgRef: { current: null },
      pathRef: { current: null },
      turbulenceRef: { current: null },
      displacementRef: { current: null },
      ballRef: { current: null },
      maskRef: { current: null },
      maskPathRef: { current: null },
      frameRef: { current: null },
      variationRef: { current: [] },
      pointerRef: { current: { x: 0, y: 0 } },
      interactionRef: { current: 0 },
      samplesRef: { current: [] },
      totalRef: { current: 0 },
      ballModeRef: { current: "hidden" },
      drawnRef: { current: 0 },
      reducedMotionRef: { current: false },
      patternRef: { current: [] },
      patternLenRef: { current: 0 },
      speedRef: { current: 0 },
      lastDrawnRef: { current: 0 },
      lastTimeRef: { current: 0 },
      lastAppliedDrawnRef: { current: -1 },
      geometryRef: { current: { width: 0, height: 0 } },
      blobsRef: { current: [] },
      lowPowerRef: { current: false },
      stepRef: { current: SAMPLE_STEP },
      measuredRef: { current: false },
    };
  }

  return runtimeRef.current;
}

type ScrollThreadRefs = ReturnType<typeof useScrollThreadRuntime>;

function useScrollThreadDrawing(refs: ScrollThreadRefs) {
  const {
    svgRef,
    pathRef,
    ballRef,
    maskPathRef,
    samplesRef,
    totalRef,
    ballModeRef,
    drawnRef,
    reducedMotionRef,
    patternRef,
    patternLenRef,
    speedRef,
    lastDrawnRef,
    lastTimeRef,
    lastAppliedDrawnRef,
    stepRef,
  } = refs;

  // Length along the path whose point sits at the "pen tip" for the current
  // scroll position. Scanning to the first sample below the tip line makes
  // the ball race around orbit loops as the tip sweeps their y-range.
  const tipLength = useCallback(() => {
    const samples = samplesRef.current;
    if (samples.length === 0) return 0;
    // The tip sits at 80% of the viewport, easing down to the viewport bottom
    // as scrolling completes, so the ball reaches the thread's end at the
    // footer instead of stalling a fifth of a screen above it.
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll <= 0 ? 1 : Math.min(1, window.scrollY / maxScroll);
    const tipY = window.scrollY + window.innerHeight * (0.8 + 0.2 * progress);
    let i = 0;
    while (i < samples.length - 1 && samples[i].y < tipY) i += 1;
    return Math.min(i * stepRef.current, totalRef.current);
  }, [samplesRef, stepRef, totalRef]);

  const drawThread = useCallback(() => {
    const maskPath = maskPathRef.current;
    const ball = ballRef.current;
    const samples = samplesRef.current;
    if (!maskPath || !ball || samples.length === 0) return;
    if (reducedMotionRef.current) {
      maskPath.style.strokeDasharray = "";
      return;
    }
    const gap = Math.ceil(totalRef.current) + 10;
    if (ballModeRef.current === "hidden") {
      maskPath.style.strokeDasharray = `0 ${gap}`;
      ball.style.opacity = "0";
      return;
    }
    if (ballModeRef.current === "live") drawnRef.current = tipLength();
    const drawn = Math.max(0, Math.min(drawnRef.current, totalRef.current));
    if (Math.abs(drawn - lastAppliedDrawnRef.current) < 0.5) return;
    lastAppliedDrawnRef.current = drawn;
    maskPath.style.strokeDasharray = `${drawn} ${gap}`;

    // Smoothed drawing speed (only forward motion counts; retreating just
    // lets it decay — marks already on the page stay put).
    const now = performance.now();
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.25);
    if (dt > 0.001) {
      const instant = Math.max(0, (drawn - lastDrawnRef.current) / dt);
      speedRef.current += (instant - speedRef.current) * (1 - Math.exp(-dt / 0.15));
    }
    lastTimeRef.current = now;
    lastDrawnRef.current = drawn;

    // Lay down ink just ahead of the reveal edge: solid runs while slow,
    // skip-marks with speed-sized gaps while fast. Once laid, never redrawn.
    if (drawn + 40 > patternLenRef.current && patternLenRef.current < totalRef.current + 40) {
      const pathElement = pathRef.current;
      patternLenRef.current = extendScrollThreadDashPattern({
        pattern: patternRef.current,
        patternLength: patternLenRef.current,
        targetLength: drawn + 40,
        totalLength: totalRef.current,
        speed: speedRef.current,
      });
      if (pathElement) {
        pathElement.style.strokeDasharray = patternRef.current
          .map((number) => number.toFixed(1))
          .join(" ");
      }
    }
    const point = samples[Math.min(Math.round(drawn / stepRef.current), samples.length - 1)];
    const svgWidth = svgRef.current?.clientWidth || window.innerWidth;
    const x = (point.x / 1000) * svgWidth - BALL_R;
    const y = point.y - BALL_R;
    const roll = (drawn / (2 * Math.PI * BALL_R)) * 360;
    ball.style.opacity = "1";
    ball.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${roll.toFixed(0)}deg)`;
  }, [
    ballRef,
    ballModeRef,
    drawnRef,
    lastAppliedDrawnRef,
    lastDrawnRef,
    lastTimeRef,
    maskPathRef,
    patternLenRef,
    patternRef,
    pathRef,
    reducedMotionRef,
    samplesRef,
    speedRef,
    stepRef,
    svgRef,
    tipLength,
    totalRef,
  ]);

  return { tipLength, drawThread };
}

function useScrollThreadGeometry(
  refs: ScrollThreadRefs,
  drawThread: () => void,
) {
  const {
    svgRef,
    pathRef,
    turbulenceRef,
    maskRef,
    maskPathRef,
    variationRef,
    totalRef,
    patternRef,
    patternLenRef,
    speedRef,
    lastDrawnRef,
    lastAppliedDrawnRef,
    geometryRef,
    blobsRef,
    stepRef,
    samplesRef,
    measuredRef,
  } = refs;

  const measure = useCallback((force = false) => {
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
    // Skip rebuilds when geometry is effectively unchanged (mobile URL-bar
    // show/hide fires resize/RO constantly) — a rebuild resets the laid ink
    // and re-runs the expensive path sampling.
    const svgWidth = Math.max(svg.clientWidth, 1);
    // The visible path uses vector-effect: non-scaling-stroke (see globals.css),
    // so its width is a constant screen-pixel value regardless of the SVG's
    // non-uniform scaling — no per-width compensation needed here.
    if (!force
      && Math.abs(geometryRef.current.width - svgWidth) < 2
      && Math.abs(geometryRef.current.height - documentHeight) < 8) {
      return;
    }
    geometryRef.current = { width: svgWidth, height: documentHeight };
    blobsRef.current = Array.from(document.querySelectorAll<HTMLElement>(".parallax-blob"));

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

    // Trace the nav ball's journey: start at the very top (y 0) where it
    // drops in over the first letter, sweep under the name to the last
    // letter where it tumbles out of the header, then continue down.
    const logoShells = document.querySelectorAll<HTMLElement>(".nav-name .nav-name-letter-shell");
    const firstLetter = logoShells[0];
    const lastLetter = logoShells[logoShells.length - 1];
    const points: ScrollThreadPoint[] = [];
    const toViewBoxX = (px: number) => Math.max(20, Math.min(980, (px / svgWidth) * 1000));
    if (firstLetter && lastLetter) {
      const firstRect = firstLetter.getBoundingClientRect();
      const lastRect = lastLetter.getBoundingClientRect();
      points.push({ x: toViewBoxX(firstRect.left + firstRect.width / 2), y: 0 });
      points.push({ x: toViewBoxX(lastRect.right), y: 72 });
    } else {
      points.push({ x: 700 + randomAt(0) * 210, y: 0 });
    }

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
      y: documentHeight,
    });

    svg.setAttribute("viewBox", `0 0 1000 ${documentHeight}`);
    svg.style.height = `${documentHeight}px`;
    const pathData = buildScrollThreadPath(points, variation);
    path.setAttribute("d", pathData);
    maskPathRef.current?.setAttribute("d", pathData);
    if (maskRef.current) {
      maskRef.current.setAttribute("x", "0");
      maskRef.current.setAttribute("y", "0");
      maskRef.current.setAttribute("width", "1000");
      maskRef.current.setAttribute("height", `${documentHeight}`);
    }

    totalRef.current = path.getTotalLength();

    // The path changed shape, so ink laid against the old geometry no longer
    // lines up — start the speed-based dash pattern over.
    patternRef.current = [];
    patternLenRef.current = 0;
    lastDrawnRef.current = 0;
    lastAppliedDrawnRef.current = -1;
    speedRef.current = 0;
    path.style.strokeDasharray = "";
    const step = stepRef.current;
    const count = Math.max(1, Math.ceil(totalRef.current / step));
    samplesRef.current = Array.from({ length: count + 1 }, (_, index) => {
      const p = path.getPointAtLength(Math.min(index * step, totalRef.current));
      return { x: p.x, y: p.y };
    });
    measuredRef.current = true;
    drawThread();
  }, [
    blobsRef,
    drawThread,
    geometryRef,
    lastAppliedDrawnRef,
    lastDrawnRef,
    maskPathRef,
    maskRef,
    measuredRef,
    patternLenRef,
    patternRef,
    pathRef,
    samplesRef,
    speedRef,
    stepRef,
    svgRef,
    totalRef,
    turbulenceRef,
    variationRef,
  ]);

  return measure;
}

function useScrollThreadMotion(
  refs: ScrollThreadRefs,
  pathname: string,
  drawThread: () => void,
  tipLength: () => number,
  measure: (force?: boolean) => void,
) {
  const {
    svgRef,
    pathRef,
    displacementRef,
    frameRef,
    pointerRef,
    interactionRef,
    ballModeRef,
    drawnRef,
    reducedMotionRef,
    blobsRef,
    lowPowerRef,
    stepRef,
    measuredRef,
  } = refs;

  const update = useCallback(() => {
    frameRef.current = null;
    const path = pathRef.current;
    if (!path) return;

    // Pointer sway, filter turbulence and blob parallax are desktop garnish;
    // on touch devices they only burn the main thread during scroll.
    if (!lowPowerRef.current) {
      const svg = svgRef.current;
      if (svg) {
        svg.style.translate = `${(pointerRef.current.x * 4).toFixed(2)}px ${(pointerRef.current.y * 3).toFixed(2)}px`;
      }
      if (displacementRef.current) {
        displacementRef.current.setAttribute("scale", `${(0.25 + interactionRef.current * 1.1).toFixed(2)}`);
      }
      blobsRef.current.forEach((blob, index) => {
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
    }
    drawThread();
    interactionRef.current *= 0.9;
    if (interactionRef.current > 0.015) {
      frameRef.current = requestAnimationFrame(update);
    }
  }, [
    blobsRef,
    displacementRef,
    drawThread,
    frameRef,
    interactionRef,
    lowPowerRef,
    pathRef,
    pointerRef,
    svgRef,
  ]);

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
    // Gate reactive re-measures until the deferred initial measure has run,
    // so early ResizeObserver/resize events can't trigger the expensive path
    // sampling while the page is still hydrating.
    const remeasure = () => {
      if (measuredRef.current) measure(false);
    };
    const resizeObserver = new ResizeObserver(() => {
      remeasure();
      schedule();
    });

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lowPowerRef.current = window.matchMedia("(pointer: coarse)").matches;
    if (lowPowerRef.current) {
      stepRef.current = SAMPLE_STEP_LOW_POWER;
      // The hand-drawn wobble filter forces a full re-rasterization of the
      // document-height SVG on every reveal-edge change — far too costly on
      // mobile GPUs, and the curve randomness alone still reads hand-drawn.
      pathRef.current?.removeAttribute("filter");
    }

    // The thread is invisible until the nav ball hands off (~6s in), so the
    // costly initial build can wait until the main thread is idle instead of
    // competing with hydration (mobile TBT).
    let idleHandle: number | undefined;
    const scheduleInitialMeasure = () => {
      const run = () => {
        idleHandle = undefined;
        measure(true);
        update();
      };
      idleHandle = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 2500 })
        : window.setTimeout(run, 350);
    };
    scheduleInitialMeasure();
    const pageShell = document.querySelector<HTMLElement>("[data-page-shell]");
    if (pageShell) resizeObserver.observe(pageShell);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", remeasure);

    // One-time handoff: when the nav ball tumbles out of the header, sweep
    // the thread from the logo down to the current tip, then follow scroll.
    const startBall = () => {
      if (reducedMotionRef.current || ballModeRef.current !== "hidden") return;
      if (!measuredRef.current) measure(true);
      // The timeout fallback can fire while the longer nav physics sequence is
      // still running. Explicitly retire that ball before revealing this one.
      window.dispatchEvent(new Event("scroll-ball-start"));
      ballModeRef.current = "catchup";
      const startTime = performance.now();
      const tick = (now: number) => {
        if (ballModeRef.current !== "catchup") return;
        const k = Math.min(1, (now - startTime) / BALL_CATCHUP_MS);
        drawnRef.current = tipLength() * (1 - (1 - k) ** 3);
        drawThread();
        if (k < 1) requestAnimationFrame(tick);
        else ballModeRef.current = "live";
      };
      requestAnimationFrame(tick);
    };
    window.addEventListener("nav-ball-exit", startBall);
    const ballTimer = window.setTimeout(startBall, BALL_HANDOFF_FALLBACK_MS);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("nav-ball-exit", startBall);
      window.clearTimeout(ballTimer);
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
      }
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [
    ballModeRef,
    drawnRef,
    drawThread,
    frameRef,
    interactionRef,
    lowPowerRef,
    measure,
    measuredRef,
    pathname,
    pathRef,
    pointerRef,
    reducedMotionRef,
    stepRef,
    tipLength,
    update,
  ]);
}

export function ScrollThread() {
  const refs = useScrollThreadRuntime();
  const pathname = usePathname();
  const { tipLength, drawThread } = useScrollThreadDrawing(refs);
  const measure = useScrollThreadGeometry(refs, drawThread);
  useScrollThreadMotion(refs, pathname, drawThread, tipLength, measure);
  const {
    svgRef,
    pathRef,
    turbulenceRef,
    displacementRef,
    ballRef,
    maskRef,
    maskPathRef,
  } = refs;

  return (
    <>
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
        <mask ref={maskRef} id="thread-reveal" maskUnits="userSpaceOnUse">
          {/* No non-scaling-stroke here: its dash lengths must stay in user
              units so the reveal edge tracks getPointAtLength exactly. */}
          <path ref={maskPathRef} fill="none" stroke="#fff" strokeWidth="10" />
        </mask>
      </defs>
      {/* Uses vector-effect: non-scaling-stroke (globals.css) so the visible
          thread keeps a constant screen-pixel width in every direction instead
          of flattening on the horizontal runs. The reveal mask below stays in
          user units — it only has to be wide enough to cover this stroke. */}
      <path
        ref={pathRef}
        className="scroll-thread-path"
        fill="none"
        filter="url(#living-thread)"
        mask="url(#thread-reveal)"
      />
    </svg>
    <div ref={ballRef} className="scroll-thread-ball" aria-hidden="true" />
    </>
  );
}
