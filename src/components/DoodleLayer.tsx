"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Pencil, X } from "lucide-react";

export function DoodleLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const previous = document.createElement("canvas");
    previous.width = canvas.width;
    previous.height = canvas.height;
    previous.getContext("2d")?.drawImage(canvas, 0, 0);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (previous.width && previous.height) {
      context.drawImage(previous, 0, 0, previous.width, previous.height, 0, 0, window.innerWidth, window.innerHeight);
    }
  }, []);

  useEffect(() => {
    prepareCanvas();
    window.addEventListener("resize", prepareCanvas);
    return () => window.removeEventListener("resize", prepareCanvas);
  }, [prepareCanvas]);

  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [active]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const next = pointFromEvent(event);
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink-strong").trim();
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, next.x, next.y);
    context.strokeStyle = ink || "#3d5b57";
    context.lineWidth = event.pointerType === "touch" ? 1.5 : 1.1;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    lastPointRef.current = next;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`doodle-canvas ${active ? "doodle-canvas-active" : ""}`}
        aria-hidden="true"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={() => (drawingRef.current = false)}
        onPointerCancel={() => (drawingRef.current = false)}
      />
      <div className="doodle-tools" aria-label="Drawing tools">
        {active && (
          <button type="button" onClick={clear} className="doodle-tool" aria-label="Clear drawing">
            <Eraser className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setActive((value) => !value)}
          className={`doodle-tool ${active ? "doodle-tool-active" : ""}`}
          aria-label={active ? "Exit drawing mode" : "Draw on this page"}
          aria-pressed={active}
        >
          {active ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          <span>{active ? "Done" : "Doodle"}</span>
        </button>
      </div>
      {active && <p className="doodle-hint">Draw anywhere · Esc closes</p>}
    </>
  );
}
