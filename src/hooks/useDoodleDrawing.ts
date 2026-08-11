"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { drawAction, type DrawingAction, type Tool } from "@/lib/doodle-canvas";
import { appendDrawingPoint, createDrawingAction } from "@/lib/doodle-drawing";

const PORTRAIT_SELECTOR = "[data-doodle-portrait]";

type DoodleDrawingOptions = {
  tool: Tool;
  color: string;
  weight: number;
};

export function useDoodleDrawing({
  tool,
  color,
  weight,
}: DoodleDrawingOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<DrawingAction[]>([]);
  const draftRef = useRef<DrawingAction | null>(null);
  const drawingRef = useRef(false);
  const canvasParallaxOffsetRef = useRef(0);
  const canvasPageOriginRef = useRef({ x: 0, y: 0 });
  const defaultAnimationFrameRef = useRef<number | null>(null);
  const defaultAnimationProgressRef = useRef(1);
  const defaultActionCountRef = useRef(0);
  const [historySize, setHistorySize] = useState(0);

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

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => ({
    x: event.clientX + window.scrollX,
    y: event.clientY + window.scrollY - canvasParallaxOffsetRef.current,
  });

  const startDrawing = (event: ReactPointerEvent<HTMLDivElement>) => {
    const point = pointFromEvent(event);
    const portrait = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR)?.getBoundingClientRect();
    drawingRef.current = true;
    draftRef.current = createDrawingAction({
      point,
      tool,
      color,
      width: weight,
      portraitBound: Boolean(
        portrait
        && event.clientX >= portrait.left
        && event.clientX <= portrait.right
        && event.clientY >= portrait.top
        && event.clientY <= portrait.bottom
      ),
    });
    if (event.pointerType !== "touch") event.currentTarget.setPointerCapture(event.pointerId);
    redraw();
  };

  const draw = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || !draftRef.current) return;
    draftRef.current = appendDrawingPoint(draftRef.current, pointFromEvent(event));
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

  const undo = useCallback(() => {
    actionsRef.current.pop();
    if (actionsRef.current.length < defaultActionCountRef.current) {
      defaultActionCountRef.current = actionsRef.current.length;
    }
    setHistorySize(actionsRef.current.length);
    redraw();
  }, [redraw]);

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

  return {
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
  };
}
