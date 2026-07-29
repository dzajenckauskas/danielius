"use client";

import { useEffect, useRef, useState } from "react";

export type ResizeDirection = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type PortraitSize = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

/**
 * Drag-to-move and edge-resize behaviour for the hero portrait, plus the
 * `portrait-resize-mode` / `portrait-geometry-change` events other components
 * (DoodleLayer, its hit area) sync against. Kept off Hero.tsx so the layout
 * component isn't tangled with pointer-math state.
 */
export function usePortraitGeometry() {
  const portraitCompositionRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    offsetX: number;
    offsetY: number;
    direction: ResizeDirection;
  } | null>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [portraitSize, setPortraitSize] = useState<PortraitSize | null>(null);
  const [portraitResizeEnabled, setPortraitResizeEnabled] = useState(false);

  useEffect(() => {
    const handleResizeMode = (event: Event) => {
      setPortraitResizeEnabled((event as CustomEvent<{ enabled: boolean }>).detail.enabled);
    };
    window.addEventListener("portrait-resize-mode", handleResizeMode);
    return () => window.removeEventListener("portrait-resize-mode", handleResizeMode);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("portrait-geometry-change"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [portraitSize]);

  const startPortraitResize = (event: React.PointerEvent<HTMLButtonElement>, direction: ResizeDirection) => {
    const composition = portraitCompositionRef.current;
    if (!composition) return;
    const frame = composition.querySelector<HTMLElement>("[data-doodle-portrait]");
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    resizeStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      offsetX: portraitSize?.offsetX ?? 0,
      offsetY: portraitSize?.offsetY ?? 0,
      direction,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.stopPropagation();
    event.preventDefault();
  };

  const resizePortrait = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = resizeStartRef.current;
    const composition = portraitCompositionRef.current;
    if (!start || !composition) return;
    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;
    const resizingLeft = start.direction.includes("left");
    const resizingRight = start.direction.includes("right");
    const resizingTop = start.direction.includes("top");
    const resizingBottom = start.direction.includes("bottom");
    const margin = 12;
    const minWidth = Math.min(260, window.innerWidth - margin * 2);
    const minHeight = 280;
    const leftLimit = Math.min(margin, start.left);
    const rightLimit = Math.max(window.innerWidth - margin, start.right);
    const topLimit = Math.min(margin, start.top);
    const bottomLimit = Math.max(window.innerHeight - margin, start.bottom);
    const nextLeft = resizingLeft
      ? Math.min(start.right - minWidth, Math.max(leftLimit, start.left + deltaX))
      : start.left;
    const nextRight = resizingRight
      ? Math.max(start.left + minWidth, Math.min(rightLimit, start.right + deltaX))
      : start.right;
    const nextTop = resizingTop
      ? Math.min(start.bottom - minHeight, Math.max(topLimit, start.top + deltaY))
      : start.top;
    const nextBottom = resizingBottom
      ? Math.max(start.top + minHeight, Math.min(bottomLimit, start.bottom + deltaY))
      : start.bottom;
    setPortraitSize({
      width: nextRight - nextLeft,
      height: nextBottom - nextTop,
      offsetX: start.offsetX + nextRight - start.right,
      offsetY: start.offsetY + nextTop - start.top,
    });
  };

  const finishPortraitResize = () => {
    resizeStartRef.current = null;
  };

  const startPortraitDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!portraitResizeEnabled || (event.target as HTMLElement).closest(".hero-portrait-resize-edge")) return;
    const frame = portraitCompositionRef.current?.querySelector<HTMLElement>("[data-doodle-portrait]");
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      offsetX: portraitSize?.offsetX ?? 0,
      offsetY: portraitSize?.offsetY ?? 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const dragPortrait = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start) return;
    const margin = 12;
    const desiredX = event.clientX - start.pointerX;
    const desiredY = event.clientY - start.pointerY;
    const minX = Math.min(margin - start.left, window.innerWidth - margin - start.right);
    const maxX = Math.max(margin - start.left, window.innerWidth - margin - start.right);
    const minY = Math.min(margin - start.top, window.innerHeight - margin - start.bottom);
    const maxY = Math.max(margin - start.top, window.innerHeight - margin - start.bottom);
    setPortraitSize((current) => ({
      width: current?.width ?? start.right - start.left,
      height: current?.height ?? start.bottom - start.top,
      offsetX: start.offsetX + Math.min(maxX, Math.max(minX, desiredX)),
      offsetY: start.offsetY + Math.min(maxY, Math.max(minY, desiredY)),
    }));
  };

  const finishPortraitDrag = () => {
    dragStartRef.current = null;
  };

  return {
    portraitCompositionRef,
    portraitSize,
    setPortraitSize,
    portraitResizeEnabled,
    setPortraitResizeEnabled,
    startPortraitResize,
    resizePortrait,
    finishPortraitResize,
    startPortraitDrag,
    dragPortrait,
    finishPortraitDrag,
  };
}
