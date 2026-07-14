"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Circle,
  Eraser,
  Minus,
  Pencil,
  Send,
  Sparkles,
  Square,
  Triangle,
  Undo2,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  DoodleFormValues,
  doodleFormSchema,
  getDoodleFormValues,
  getYupFieldErrors,
} from "@/lib/doodle-form";
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
};

const COLORS = ["#3d5b57", "#b59bd7", "#8fbccc", "#d891aa", "#d2ae6c", "#191a1c"];
const WEIGHTS = [2, 4, 7];
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "pen", label: "Pen", icon: Pencil },
  { id: "blob", label: "Blob", icon: Sparkles },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "square", label: "Square", icon: Square },
  { id: "triangle", label: "Triangle", icon: Triangle },
];

const PORTRAIT_SELECTOR = "[data-doodle-portrait]";

function defaultPortraitDoodle(rect: DOMRect): DrawingAction[] {
  const pageLeft = rect.left + window.scrollX;
  const pageTop = rect.top + window.scrollY;
  const point = (x: number, y: number): Point => ({
    x: pageLeft + rect.width * x,
    y: pageTop + rect.height * y,
  });
  const ink = "#3d5b57";

  const stroke = (
    width: number,
    points: Array<[number, number]>,
    smooth = true,
  ): DrawingAction => ({
    tool: "pen",
    color: ink,
    width,
    smooth,
    points: points.map(([x, y]) => point(x, y)),
  });

  return [
    // Compact line-art baseball cap resting high on the hair.
    {
      ...stroke(1.9, [[0.50, 0.03], [0.545, 0.036], [0.585, 0.058], [0.615, 0.092], [0.628, 0.14], [0.65, 0.15], [0.668, 0.165], [0.673, 0.182], [0.663, 0.198], [0.633, 0.212], [0.594, 0.218], [0.548, 0.216], [0.50, 0.208], [0.455, 0.195], [0.416, 0.176], [0.365, 0.142], [0.375, 0.098], [0.395, 0.064], [0.427, 0.042], [0.462, 0.033], [0.50, 0.03]]),
      closed: true,
    },
    stroke(1.7, [[0.365, 0.142], [0.435, 0.145], [0.525, 0.147], [0.628, 0.14]]),
    stroke(1.4, [[0.48, 0.032], [0.47, 0.06], [0.465, 0.098], [0.465, 0.143]]),
    stroke(1.4, [[0.51, 0.032], [0.526, 0.06], [0.534, 0.098], [0.536, 0.146]]),
    stroke(1.5, [[0.488, 0.03], [0.488, 0.019], [0.493, 0.013], [0.501, 0.014], [0.505, 0.021], [0.505, 0.031]]),

    // Deliberately asymmetric glasses, traced from the supplied doodle.
    stroke(2, [[0.385, 0.365], [0.395, 0.345], [0.425, 0.332], [0.465, 0.332], [0.502, 0.344], [0.52, 0.366], [0.52, 0.405], [0.507, 0.432], [0.477, 0.45], [0.435, 0.45], [0.405, 0.44], [0.388, 0.415], [0.385, 0.365]]),
    stroke(2, [[0.57, 0.378], [0.587, 0.36], [0.62, 0.352], [0.65, 0.36], [0.673, 0.38], [0.685, 0.41], [0.68, 0.44], [0.66, 0.462], [0.632, 0.472], [0.603, 0.462], [0.58, 0.44], [0.57, 0.408], [0.57, 0.378]]),
    stroke(1.9, [[0.518, 0.378], [0.535, 0.365], [0.553, 0.364], [0.57, 0.378]]),
    stroke(1.25, [[0.535, 0.379], [0.549, 0.368], [0.565, 0.37]]),
    stroke(1.9, [[0.31, 0.372], [0.348, 0.368], [0.387, 0.371]]),
    stroke(1.9, [[0.682, 0.407], [0.72, 0.407], [0.752, 0.405]]),
  ];
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
    const x = left;
    const y = top;
    context.globalAlpha = 0.58;
    context.moveTo(x + width * 0.5, y);
    context.bezierCurveTo(x + width * 0.9, y - height * 0.04, x + width * 1.08, y + height * 0.32, x + width * 0.9, y + height * 0.62);
    context.bezierCurveTo(x + width * 0.72, y + height * 1.04, x + width * 0.2, y + height * 1.08, x + width * 0.06, y + height * 0.68);
    context.bezierCurveTo(x - width * 0.09, y + height * 0.28, x + width * 0.15, y + height * 0.04, x + width * 0.5, y);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const studioRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<DrawingAction[]>([]);
  const draftRef = useRef<DrawingAction | null>(null);
  const drawingRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);
  const defaultAnimationFrameRef = useRef<number | null>(null);
  const defaultAnimationProgressRef = useRef(1);
  const defaultActionCountRef = useRef(0);
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
  const [studioOpen, setStudioOpen] = useState(true);
  const [studioOffset, setStudioOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [weight, setWeight] = useState(WEIGHTS[0]);
  const [historySize, setHistorySize] = useState(0);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof DoodleFormValues, string>>>({});

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
    context.setTransform(ratio, 0, 0, ratio, -window.scrollX * ratio, -window.scrollY * ratio);
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
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
    redraw();
  }, [redraw]);

  useEffect(() => {
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
    if (!frame || actionsRef.current.length) return;
    let seeded = false;
    const seedDoodle = () => {
      if (seeded || actionsRef.current.length) return;
      seeded = true;
      actionsRef.current = defaultPortraitDoodle(frame.getBoundingClientRect());
      defaultActionCountRef.current = actionsRef.current.length;
      defaultAnimationProgressRef.current = 0;
      setHistorySize(actionsRef.current.length);
      prepareCanvas();
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
  }, [prepareCanvas, redraw]);

  useEffect(() => {
    if (!active && historySize === 0) return;
    prepareCanvas();
    const handleResize = () => {
      prepareCanvas();
      setStudioOffset({ x: 0, y: 0 });
    };
    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        redraw();
      });
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
    };
  }, [active, historySize, prepareCanvas, redraw]);

  useEffect(() => {
    if (!active) return;
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sendOpen) setSendOpen(false);
        else if (studioOpen) setStudioOpen(false);
        else setActive(false);
        return;
      }

      const isUndo = (event.metaKey || event.ctrlKey)
        && !event.shiftKey
        && event.key.toLowerCase() === "z";
      if (!isUndo || sendOpen || actionsRef.current.length === 0) return;

      event.preventDefault();
      actionsRef.current.pop();
      setHistorySize(actionsRef.current.length);
      redraw();
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [active, redraw, sendOpen, studioOpen]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + window.scrollX,
      y: event.clientY - rect.top + window.scrollY,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    drawingRef.current = true;
    draftRef.current = { tool, color, width: weight, points: [point] };
    event.currentTarget.setPointerCapture(event.pointerId);
    redraw();
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
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

  const undo = () => {
    actionsRef.current.pop();
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

  const exportPortraitComposite = async () => {
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
    return output.toDataURL("image/png");
  };

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
      const [artwork, composite] = await Promise.all([
        Promise.resolve(exportArtwork()),
        exportPortraitComposite(),
      ]);
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
          page: window.location.href,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        fieldErrors?: Partial<Record<keyof DoodleFormValues, string>>;
      };
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
      <canvas
        ref={canvasRef}
        className={`doodle-canvas ${active ? "doodle-canvas-active" : ""}`}
        aria-label="Doodle canvas"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
      />

      {active && studioOpen && (
        <aside
          ref={studioRef}
          className="doodle-studio"
          aria-label="Doodle studio"
          style={{ transform: `translate3d(${studioOffset.x}px, ${studioOffset.y}px, 0)` }}
        >
          <div
            className="doodle-studio-heading"
            title="Drag to move"
            onPointerDown={startStudioDrag}
            onPointerMove={moveStudio}
            onPointerUp={finishStudioDrag}
            onPointerCancel={finishStudioDrag}
          >
            <div><small>Make your mark</small><strong>Doodle studio</strong></div>
            <div className="doodle-studio-heading-actions">
              <button type="button" onClick={() => setStudioOpen(false)} aria-label="Minimize doodle studio" title="Minimize studio"><Minus /></button>
              <button type="button" onClick={() => setActive(false)} aria-label="Close doodle studio and exit drawing mode" title="Exit drawing mode"><X /></button>
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
              <span>Weight</span>
              <div className="doodle-weights">
                {WEIGHTS.map((value) => (
                  <button key={value} type="button" className={weight === value ? "is-selected" : ""} onClick={() => setWeight(value)} aria-label={`${value} pixel line weight`} aria-pressed={weight === value}>
                    <i style={{ height: value }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="doodle-studio-actions">
            <button type="button" onClick={undo} disabled={!historySize}><Undo2 />Undo</button>
            <button type="button" onClick={clear} disabled={!historySize}><Eraser />Clear</button>
            <button type="button" className="doodle-send-button" onClick={() => { sendOpenedAtRef.current = Date.now(); setTurnstileToken(""); setSendOpen(true); setSendState("idle"); setSendError(""); setFieldErrors({}); }} disabled={!historySize}><Send />Send it</button>
          </div>
        </aside>
      )}

      {active && !studioOpen && !sendOpen && (
        <button
          type="button"
          className="doodle-studio-restore"
          onClick={() => setStudioOpen(true)}
          aria-label="Open doodle studio"
        >
          <Pencil aria-hidden="true" />
          <span>Studio</span>
        </button>
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
                <p>Thanks for saying hello in your own way. I’ll reply to the email you shared.</p>
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

      <div className="doodle-tools" aria-label="Page tools">
        <ThemeToggle />
        <button type="button" onClick={() => {
          if (!active) setStudioOpen(true);
          setActive((value) => !value);
        }} className={`doodle-tool ${active ? "doodle-tool-active" : "doodle-tool-invite"}`} aria-label={active ? "Exit drawing mode" : "Draw on this page"} aria-pressed={active}>
          <span className="doodle-tool-icon" aria-hidden="true">
            {active ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </span>
          <span className="doodle-tool-label">{active ? "Done" : "Doodle"}</span>
        </button>
      </div>
      {active && !sendOpen && (
        <p className={`doodle-hint ${studioOpen ? "doodle-hint-above-studio" : "doodle-hint-above-tools"}`}>
          Draw on my portrait · Clear the starter doodle or make it stranger
        </p>
      )}
    </>
  );
}
