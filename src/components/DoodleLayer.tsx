"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Maximize2, Pencil } from "lucide-react";
import {
  DEFAULT_DOODLE_WEIGHT,
  DOODLE_COLORS,
  DoodleStudio,
} from "@/components/doodle/DoodleStudio";
import { DoodleSendPanel } from "@/components/doodle/DoodleSendPanel";
import { type Tool } from "@/lib/doodle-canvas";
import { useDoodleExport } from "@/hooks/useDoodleExport";
import { useStudioDrag } from "@/hooks/useStudioDrag";
import { useDoodleSubmission } from "@/hooks/useDoodleSubmission";
import { useDoodleDrawing } from "@/hooks/useDoodleDrawing";
import {
  defaultPortraitDoodle,
  DOODLE_PORTRAIT_SELECTOR,
  useDoodleCanvas,
} from "@/hooks/useDoodleCanvas";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function DoodleLayer() {
  const pathname = usePathname();
  const studioWidthRef = useRef(320);
  const studioWidthCapturedRef = useRef(false);
  const [active, setActive] = useState(false);
  const [studioMinimized, setStudioMinimized] = useState(false);
  const [portraitResizeEnabled, setPortraitResizeEnabled] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [doodleSurface, setDoodleSurface] = useState<HTMLElement | null>(null);
  const [doodleAnchor, setDoodleAnchor] = useState<HTMLElement | null>(null);
  const [toolsAnchor, setToolsAnchor] = useState<HTMLElement | null>(null);
  const { studioRef, studioOffset, startStudioDrag, moveStudio, finishStudioDrag } = useStudioDrag();
  const [studioPlacement, setStudioPlacement] = useState({
    left: 0,
    top: 0,
    width: 320,
    ready: false,
  });
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(DOODLE_COLORS[0]);
  const [weight, setWeight] = useState(DEFAULT_DOODLE_WEIGHT);
  const {
    canvasRef,
    hitAreaRef,
    actionsRef,
    canvasParallaxOffsetRef,
    canvasPageOriginRef,
    defaultAnimationFrameRef,
    defaultAnimationProgressRef,
    defaultActionCountRef,
    historySize,
    setHistorySize,
    redraw,
    startDrawing,
    draw,
    finishDrawing,
    cancelDrawing,
    undo,
    clear,
  } = useDoodleDrawing({ tool, color, weight });
  const { prepareCanvas } = useDoodleCanvas({
    active,
    historySize,
    canvasRef,
    hitAreaRef,
    actionsRef,
    canvasParallaxOffsetRef,
    canvasPageOriginRef,
    defaultActionCountRef,
    redraw,
  });
  const { exportArtwork, exportStrokes, exportPortraitComposite, exportPortraitCard } = useDoodleExport(actionsRef);
  const {
    sendOpen,
    sendState,
    sendError,
    turnstileToken,
    fieldErrors,
    openSend,
    closeSend,
    sendDoodle,
    validateField,
    clearFieldError,
    setTurnstileToken,
  } = useDoodleSubmission({
    pathname,
    historySize,
    exportArtwork,
    exportStrokes,
    exportPortraitComposite,
    exportPortraitCard,
  });

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
    if (!active) return;
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sendOpen) closeSend();
        else {
          setPortraitResizeEnabled(false);
          setActive(false);
        }
        return;
      }

      const isUndo = (event.metaKey || event.ctrlKey)
        && !event.shiftKey
        && event.key.toLowerCase() === "z";
      if (!isUndo || sendOpen || historySize === 0) return;

      event.preventDefault();
      undo();
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [active, closeSend, historySize, sendOpen, undo]);

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
        <DoodleStudio
          studioRef={studioRef}
          placement={studioPlacement}
          offset={studioOffset}
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          weight={weight}
          setWeight={setWeight}
          historySize={historySize}
          portraitResizeEnabled={portraitResizeEnabled}
          onStartDrag={startStudioDrag}
          onMoveDrag={moveStudio}
          onFinishDrag={finishStudioDrag}
          onMinimize={() => setStudioMinimized(true)}
          onClose={() => { setPortraitResizeEnabled(false); setActive(false); }}
          onUndo={undo}
          onClear={clear}
          onToggleResize={() => setPortraitResizeEnabled((enabled) => !enabled)}
          onSend={openSend}
        />
      )}

      {sendOpen && (
        <DoodleSendPanel
          state={sendState}
          error={sendError}
          fieldErrors={fieldErrors}
          turnstileToken={turnstileToken}
          turnstileSiteKey={TURNSTILE_SITE_KEY}
          onBackdropPointerDown={(event) => { if (event.target === event.currentTarget) closeSend(); }}
          onClose={closeSend}
          onDone={() => { closeSend(); setActive(false); }}
          onSubmit={sendDoodle}
          onValidateField={(field, value) => { void validateField(field, value); }}
          onClearFieldError={clearFieldError}
          onTurnstileToken={setTurnstileToken}
        />
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
