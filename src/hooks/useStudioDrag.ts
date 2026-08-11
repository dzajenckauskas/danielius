"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type StudioDragState = {
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
  baseLeft: number;
  baseTop: number;
  width: number;
  height: number;
};

export function useStudioDrag() {
  const studioRef = useRef<HTMLElement>(null);
  const dragRef = useRef<StudioDragState | null>(null);
  const [studioOffset, setStudioOffset] = useState({ x: 0, y: 0 });

  const startStudioDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const studio = studioRef.current;
    if (!studio) return;
    const rect = studio.getBoundingClientRect();
    dragRef.current = {
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

  const moveStudio = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
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
    dragRef.current = null;
  };

  return { studioRef, studioOffset, startStudioDrag, moveStudio, finishStudioDrag };
}
