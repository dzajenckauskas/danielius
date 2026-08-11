import type { CSSProperties, Dispatch, PointerEventHandler, RefObject, SetStateAction } from "react";
import {
  Circle,
  Eraser,
  Minimize2,
  Pencil,
  Scaling,
  Send,
  Sparkles,
  Square,
  Triangle,
  Undo2,
  X,
} from "lucide-react";
import type { Tool } from "@/lib/doodle-canvas";

export const DOODLE_COLORS = ["#3d5b57", "#b59bd7", "#8fbccc", "#d891aa", "#d2ae6c", "#191a1c"];
export const DEFAULT_DOODLE_WEIGHT = 2;
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 12;
const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "pen", label: "Pen", icon: Pencil },
  { id: "blob", label: "Blob", icon: Sparkles },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "square", label: "Square", icon: Square },
  { id: "triangle", label: "Triangle", icon: Triangle },
];

type DoodleStudioProps = {
  studioRef: RefObject<HTMLElement | null>;
  placement: { left: number; top: number; width: number };
  offset: { x: number; y: number };
  tool: Tool;
  setTool: Dispatch<SetStateAction<Tool>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  weight: number;
  setWeight: Dispatch<SetStateAction<number>>;
  historySize: number;
  portraitResizeEnabled: boolean;
  onStartDrag: PointerEventHandler<HTMLDivElement>;
  onMoveDrag: PointerEventHandler<HTMLDivElement>;
  onFinishDrag: PointerEventHandler<HTMLDivElement>;
  onMinimize: () => void;
  onClose: () => void;
  onUndo: () => void;
  onClear: () => void;
  onToggleResize: () => void;
  onSend: () => void;
};

export function DoodleStudio({
  studioRef,
  placement,
  offset,
  tool,
  setTool,
  color,
  setColor,
  weight,
  setWeight,
  historySize,
  portraitResizeEnabled,
  onStartDrag,
  onMoveDrag,
  onFinishDrag,
  onMinimize,
  onClose,
  onUndo,
  onClear,
  onToggleResize,
  onSend,
}: DoodleStudioProps) {
  return (
    <aside
      ref={studioRef}
      className="doodle-studio"
      aria-label="Doodle studio"
      style={{
        left: placement.left,
        top: placement.top,
        right: "auto",
        bottom: "auto",
        width: placement.width,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    >
      <div
        className="doodle-studio-heading"
        title="Drag to move"
        onPointerDown={onStartDrag}
        onPointerMove={onMoveDrag}
        onPointerUp={onFinishDrag}
        onPointerCancel={onFinishDrag}
      >
        <strong>Doodle studio</strong>
        <div className="doodle-studio-heading-actions">
          <button type="button" className="doodle-studio-minimize" onClick={onMinimize} aria-label="Minimize doodle studio" title="Minimize studio"><Minimize2 /></button>
          <button type="button" onClick={onClose} aria-label="Close doodle studio and exit drawing mode" title="Exit drawing mode"><X /></button>
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
          {DOODLE_COLORS.map((value) => (
            <button key={value} type="button" className={color === value ? "is-selected" : ""} style={{ "--swatch": value } as CSSProperties} onClick={() => setColor(value)} aria-label={`Use colour ${value}`} aria-pressed={color === value} />
          ))}
        </div>
      </div>

      {tool !== "blob" && (
        <div className="doodle-setting-row">
          <label htmlFor="doodle-line-weight">Weight</label>
          <div className="doodle-weight-control">
            <input
              id="doodle-line-weight"
              type="range"
              min={MIN_WEIGHT}
              max={MAX_WEIGHT}
              step={1}
              value={weight}
              onChange={(event) => setWeight(Number(event.currentTarget.value))}
              style={{ "--weight-progress": `${((weight - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT)) * 100}%` } as CSSProperties}
              aria-label="Line weight"
              aria-valuetext={`${weight} pixels`}
            />
            <output htmlFor="doodle-line-weight">{weight}px</output>
          </div>
        </div>
      )}

      <div className="doodle-studio-actions">
        <button type="button" onClick={onUndo} disabled={!historySize}><Undo2 />Undo</button>
        <button type="button" onClick={onClear} disabled={!historySize}><Eraser />Clear</button>
        <button
          type="button"
          className={`doodle-resize-button ${portraitResizeEnabled ? "is-selected" : ""}`}
          onClick={onToggleResize}
          aria-pressed={portraitResizeEnabled}
          title={portraitResizeEnabled ? "Return to drawing" : "Resize portrait"}
        >
          <Scaling />
          <span>{portraitResizeEnabled ? "Done" : "Resize"}</span>
        </button>
        <button type="button" className="doodle-send-button" onClick={onSend} disabled={!historySize}><Send />Send it</button>
      </div>
    </aside>
  );
}
