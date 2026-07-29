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

// The portrait photo (public/avatar.png) is painted with `object-fit: cover`
// and `object-position: center 38%` inside the frame. These constants let us
// reconstruct where the image content actually lands so a doodle can be anchored
// to the face itself, not the frame — keeping its aspect ratio and position
// stable across every breakpoint (the frame's own aspect ratio is not).
export const PORTRAIT_IMAGE_ASPECT = 1149 / 1369;
const PORTRAIT_OBJECT_POSITION_Y = 0.38;

export type ImageAnchoredFrame = {
  pageLeft: number;
  pageTop: number;
  frameWidth: number;
  frameHeight: number;
  /** Intrinsic width/height of the portrait image. */
  imageAspect: number;
  /** Vertical object-position (0..1); defaults to PORTRAIT_OBJECT_POSITION_Y. */
  objectPositionY?: number;
  /**
   * Extra upward shift in image-normalized units, subtracted from every point's
   * y. Used to lift the doodle on tall (mobile) frames where it otherwise reads
   * a touch low; 0 on desktop leaves that placement untouched.
   */
  verticalNudge?: number;
};

/** The painted image rect within the frame, in frame-local pixels. */
export function coverImageRect(frame: ImageAnchoredFrame) {
  const { frameWidth: fw, frameHeight: fh, imageAspect: a } = frame;
  const objectPositionY = frame.objectPositionY ?? PORTRAIT_OBJECT_POSITION_Y;
  let displayWidth: number;
  let displayHeight: number;
  if (fw / fh >= a) {
    // Frame is wider than the image → width binds, image overflows top/bottom.
    displayWidth = fw;
    displayHeight = fw / a;
  } else {
    // Frame is taller than the image → height binds, image overflows sides.
    displayHeight = fh;
    displayWidth = fh * a;
  }
  return {
    offsetX: (fw - displayWidth) / 2,
    offsetY: (fh - displayHeight) * objectPositionY,
    displayWidth,
    displayHeight,
  };
}

/**
 * Expand strokes whose points are 0..1 fractions of the *image content* (not
 * the frame) into absolute page pixels. Because both axes scale by the same
 * cover factor, the doodle keeps its aspect ratio and stays locked to the face
 * on any frame shape.
 */
export function expandImageStrokes(strokes: NormalizedStroke[], frame: ImageAnchoredFrame): PixelStroke[] {
  const { offsetX, offsetY, displayWidth, displayHeight } = coverImageRect(frame);
  const nudge = frame.verticalNudge ?? 0;
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
      x: frame.pageLeft + offsetX + point.x * displayWidth,
      y: frame.pageTop + offsetY + (point.y - nudge) * displayHeight,
    })),
  }));
}

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
