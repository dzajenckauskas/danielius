"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Circle,
  Eraser,
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
};

const COLORS = ["#3d5b57", "#b59bd7", "#8fbccc", "#d891aa", "#d2ae6c", "#191a1c"];
const WEIGHTS = [2, 5, 10];
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "pen", label: "Pen", icon: Pencil },
  { id: "blob", label: "Blob", icon: Sparkles },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "square", label: "Square", icon: Square },
  { id: "triangle", label: "Triangle", icon: Triangle },
];

function drawAction(context: CanvasRenderingContext2D, action: DrawingAction) {
  const [start, ...rest] = action.points;
  if (!start) return;

  context.save();
  context.strokeStyle = action.color;
  context.fillStyle = action.color;
  context.lineWidth = action.width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();

  if (action.tool === "pen") {
    context.moveTo(start.x, start.y);
    rest.forEach((point) => context.lineTo(point.x, point.y));
    if (action.points.length === 1) context.lineTo(start.x + 0.1, start.y + 0.1);
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
    context.ellipse(left + width / 2, top + height / 2, width / 2, height / 2, -0.04, 0, Math.PI * 2);
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
  const [studioOffset, setStudioOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [weight, setWeight] = useState(5);
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
    context.save();
    context.translate(-window.scrollX, -window.scrollY);
    actionsRef.current.forEach((action) => drawAction(context, action));
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
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (sendOpen) setSendOpen(false);
      else setActive(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [active, sendOpen]);

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
    const background = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#f7f5f2";
    context.fillStyle = background;
    context.fillRect(0, 0, output.width, output.height);
    context.scale(scale, scale);
    context.translate(padding - minX, padding - minY);
    actions.forEach((action) => drawAction(context, action));
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
      const response = await fetch("/api/doodles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: form.get("website"),
          issuedAtMs: sendOpenedAtRef.current,
          turnstileToken,
          artwork: exportArtwork(),
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

      {active && (
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
            <button type="button" onClick={() => setActive(false)} aria-label="Close doodle studio"><X /></button>
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
                <p>Your drawing arrives as a PNG. Add an email so I can draw—or write—back.</p>
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
        <button type="button" onClick={() => setActive((value) => !value)} className={`doodle-tool ${active ? "doodle-tool-active" : "doodle-tool-invite"}`} aria-label={active ? "Exit drawing mode" : "Draw on this page"} aria-pressed={active}>
          <span className="doodle-tool-icon" aria-hidden="true">
            {active ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </span>
          <span className="doodle-tool-label">{active ? "Done" : "Doodle"}</span>
        </button>
      </div>
      {active && !sendOpen && <p className="doodle-hint">Draw anywhere · Scroll to continue down the page</p>}
    </>
  );
}
