"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useDoodleCanvas } from "@/hooks/useDoodleCanvas";
import { useDoodleHero } from "@/hooks/useDoodleHero";
import { useDoodleKeyboardShortcuts } from "@/hooks/useDoodleKeyboardShortcuts";
import { useDoodleStudioPlacement } from "@/hooks/useDoodleStudioPlacement";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function DoodleLayer() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [studioMinimized, setStudioMinimized] = useState(false);
  const [portraitResizeEnabled, setPortraitResizeEnabled] = useState(false);
  const [toolsAnchor, setToolsAnchor] = useState<HTMLElement | null>(null);
  const { studioRef, studioOffset, startStudioDrag, moveStudio, finishStudioDrag } = useStudioDrag();
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
  const deactivate = useCallback(() => {
    setPortraitResizeEnabled(false);
    setActive(false);
  }, []);
  const { heroInView, doodleSurface, doodleAnchor } = useDoodleHero({
    pathname,
    actionsRef,
    defaultActionCountRef,
    defaultAnimationFrameRef,
    defaultAnimationProgressRef,
    prepareCanvas,
    redraw,
    setHistorySize,
    deactivate,
  });
  const { placement: studioPlacement, prepareToOpen } = useDoodleStudioPlacement(
    active,
    pathname,
    doodleAnchor,
  );
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
  useDoodleKeyboardShortcuts({
    active,
    sendOpen,
    historySize,
    closeSend,
    deactivate,
    undo,
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
          onClose={deactivate}
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
          onDone={() => { closeSend(); deactivate(); }}
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
            if (prepareToOpen()) setActive(true);
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
