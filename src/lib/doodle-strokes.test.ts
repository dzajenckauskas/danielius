import { describe, expect, it } from "vitest";
import {
  coverImageRect,
  expandImageStrokes,
  expandStrokes,
  isNormalizedStrokeArray,
  normalizeStrokes,
  PORTRAIT_IMAGE_ASPECT,
  type NormalizedStroke,
  type PixelStroke,
} from "./doodle-strokes";

const frame = { pageLeft: 100, pageTop: 50, width: 200, height: 300 };

describe("normalizeStrokes / expandStrokes", () => {
  it("are exact inverses on a frame of the same size", () => {
    const pixelStroke: PixelStroke = {
      tool: "pen",
      color: "#000",
      width: 3,
      points: [
        { x: 100, y: 50 },
        { x: 200, y: 200 },
        { x: 300, y: 350 },
      ],
    };

    const normalized = normalizeStrokes([pixelStroke], frame);
    const roundTripped = expandStrokes(normalized, frame);

    roundTripped[0].points.forEach((point, index) => {
      expect(point.x).toBeCloseTo(pixelStroke.points[index].x, 1);
      expect(point.y).toBeCloseTo(pixelStroke.points[index].y, 1);
    });
  });

  it("normalizes points as 0..1 fractions of the frame", () => {
    const [normalized] = normalizeStrokes(
      [{ tool: "circle", color: "#fff", width: 2, points: [{ x: 100, y: 50 }, { x: 300, y: 350 }] }],
      frame,
    );
    expect(normalized.points).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  });
});

describe("coverImageRect", () => {
  it("binds width when the frame is wider than the image aspect", () => {
    const rect = coverImageRect({ pageLeft: 0, pageTop: 0, frameWidth: 400, frameHeight: 100, imageAspect: 1 });
    expect(rect.displayWidth).toBe(400);
    expect(rect.displayHeight).toBe(400);
    expect(rect.offsetX).toBe(0);
  });

  it("binds height when the frame is taller than the image aspect, overflowing the sides", () => {
    const rect = coverImageRect({ pageLeft: 0, pageTop: 0, frameWidth: 100, frameHeight: 400, imageAspect: 1 });
    expect(rect.displayHeight).toBe(400);
    expect(rect.displayWidth).toBe(400);
    expect(rect.offsetX).toBeLessThan(0);
  });
});

describe("expandImageStrokes", () => {
  it("keeps image-anchored points locked to the cover-fitted image rect", () => {
    const strokes: NormalizedStroke[] = [
      { tool: "pen", color: "#000", width: 2, points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },
    ];
    const expanded = expandImageStrokes(strokes, {
      pageLeft: 0,
      pageTop: 0,
      frameWidth: 200,
      frameHeight: 200,
      imageAspect: PORTRAIT_IMAGE_ASPECT,
    });
    expect(expanded[0].points[0].x).toBeGreaterThanOrEqual(0);
    expect(expanded[0].points).toHaveLength(2);
  });
});

describe("isNormalizedStrokeArray", () => {
  it("accepts a well-formed stroke array", () => {
    expect(isNormalizedStrokeArray([
      { tool: "pen", color: "#000", width: 2, points: [{ x: 0.1, y: 0.2 }] },
    ])).toBe(true);
  });

  it.each([
    ["not an array", { tool: "pen" }],
    ["invalid tool", [{ tool: "hexagon", color: "#000", width: 2, points: [] }]],
    ["missing color", [{ tool: "pen", width: 2, points: [] }]],
    ["non-numeric point", [{ tool: "pen", color: "#000", width: 2, points: [{ x: "0", y: 0 }] }]],
  ])("rejects %s", (_label, value) => {
    expect(isNormalizedStrokeArray(value)).toBe(false);
  });
});
