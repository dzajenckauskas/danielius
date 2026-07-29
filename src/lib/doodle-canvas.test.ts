import { describe, expect, it } from "vitest";
import { blobPoints, seededRandom } from "./doodle-canvas";

describe("seededRandom", () => {
  it("is deterministic for the same seed and offset", () => {
    expect(seededRandom(0.5, 3)).toBe(seededRandom(0.5, 3));
  });

  it("varies with the offset (used to derive independent values from one seed)", () => {
    expect(seededRandom(0.5, 1)).not.toBe(seededRandom(0.5, 2));
  });

  it("stays within [0, 1)", () => {
    for (let offset = 0; offset < 50; offset += 1) {
      const value = seededRandom(0.5, offset);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("blobPoints", () => {
  it("is deterministic for a given seed and bounding box", () => {
    const first = blobPoints(0.42, 0, 0, 100, 80);
    const second = blobPoints(0.42, 0, 0, 100, 80);
    expect(second).toEqual(first);
  });

  it("produces between 6 and 10 points, all finite and roughly inside the box", () => {
    const points = blobPoints(0.17, 10, 20, 100, 80);
    expect(points.length).toBeGreaterThanOrEqual(6);
    expect(points.length).toBeLessThanOrEqual(10);
    points.forEach((point) => {
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
      // Points can overshoot the box slightly (the shape is organic, not an
      // ellipse), but should stay within a generous margin of it.
      expect(point.x).toBeGreaterThan(10 - 60);
      expect(point.x).toBeLessThan(110 + 60);
      expect(point.y).toBeGreaterThan(20 - 60);
      expect(point.y).toBeLessThan(100 + 60);
    });
  });

  it("produces a different shape for a different seed", () => {
    const a = blobPoints(0.1, 0, 0, 100, 80);
    const b = blobPoints(0.9, 0, 0, 100, 80);
    expect(a).not.toEqual(b);
  });
});
