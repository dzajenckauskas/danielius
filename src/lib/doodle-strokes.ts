// Portable, resolution-independent representation of a doodle.
//
// A doodle is authored on a <canvas> as a list of pen/shape strokes whose
// points live in absolute page pixels. To store one (as the site default) or
// carry one across the wire (when a visitor sends theirs), we normalise each
// point to the portrait frame — x and y become 0..1 fractions of the frame's
// width and height. Stroke `width` stays in pixels: it is the line weight the
// artist picked and is not tied to the frame size.
//
// `normalizeStrokes` produces this form from live canvas actions; `expandStrokes`
// turns it back into absolute-pixel strokes for a given frame. The two are exact
// inverses on a frame of the same size, so a serialized doodle replays identically.

export type DoodleTool = "pen" | "blob" | "circle" | "square" | "triangle";

export type NormalizedPoint = { x: number; y: number };

export type NormalizedStroke = {
  tool: DoodleTool;
  color: string;
  /** Line weight in pixels (unchanged across frame sizes). */
  width: number;
  /** Points as 0..1 fractions of the portrait frame. */
  points: NormalizedPoint[];
  smooth?: boolean;
  closed?: boolean;
  fillColor?: string;
  rotation?: number;
  shapeSeed?: number;
};

/** A stroke with points in absolute page pixels — what the canvas draws. */
export type PixelStroke = {
  tool: DoodleTool;
  color: string;
  width: number;
  points: Array<{ x: number; y: number }>;
  smooth?: boolean;
  closed?: boolean;
  fillColor?: string;
  rotation?: number;
  shapeSeed?: number;
};

/** The portrait frame in absolute page coordinates. */
export type DoodleFrame = {
  pageLeft: number;
  pageTop: number;
  width: number;
  height: number;
};

export function normalizeStrokes(strokes: PixelStroke[], frame: DoodleFrame): NormalizedStroke[] {
  const safeWidth = frame.width || 1;
  const safeHeight = frame.height || 1;
  return strokes.map((stroke) => ({
    tool: stroke.tool,
    color: stroke.color,
    width: stroke.width,
    smooth: stroke.smooth,
    closed: stroke.closed,
    fillColor: stroke.fillColor,
    rotation: stroke.rotation,
    shapeSeed: stroke.shapeSeed,
    points: stroke.points.map((point) => ({
      x: Number(((point.x - frame.pageLeft) / safeWidth).toFixed(4)),
      y: Number(((point.y - frame.pageTop) / safeHeight).toFixed(4)),
    })),
  }));
}

export function expandStrokes(strokes: NormalizedStroke[], frame: DoodleFrame): PixelStroke[] {
  return strokes.map((stroke) => ({
    tool: stroke.tool,
    color: stroke.color,
    width: stroke.width,
    smooth: stroke.smooth ?? true,
    closed: stroke.closed ?? false,
    fillColor: stroke.fillColor,
    rotation: stroke.rotation,
    shapeSeed: stroke.shapeSeed,
    points: stroke.points.map((point) => ({
      x: frame.pageLeft + frame.width * point.x,
      y: frame.pageTop + frame.height * point.y,
    })),
  }));
}

/** Runtime guard for strokes arriving over the wire (untrusted input). */
export function isNormalizedStrokeArray(value: unknown): value is NormalizedStroke[] {
  const tools = new Set(["pen", "blob", "circle", "square", "triangle"]);
  return (
    Array.isArray(value)
    && value.every((stroke) =>
      typeof stroke === "object"
      && stroke !== null
      && tools.has((stroke as NormalizedStroke).tool)
      && typeof (stroke as NormalizedStroke).color === "string"
      && typeof (stroke as NormalizedStroke).width === "number"
      && Array.isArray((stroke as NormalizedStroke).points)
      && (stroke as NormalizedStroke).points.every(
        (point) => typeof point?.x === "number" && typeof point?.y === "number",
      ),
    )
  );
}
