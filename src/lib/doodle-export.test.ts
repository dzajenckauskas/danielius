import { describe, expect, it } from "vitest";
import { getArtworkBounds } from "./doodle-export";

describe("getArtworkBounds", () => {
  it("returns null for an empty drawing", () => {
    expect(getArtworkBounds([])).toBeNull();
  });

  it("adds export padding around freehand points", () => {
    expect(getArtworkBounds([{
      tool: "pen",
      color: "#000",
      width: 2,
      points: [{ x: 100, y: 200 }, { x: 150, y: 260 }],
    }])).toEqual({ minX: 100, minY: 200, width: 130, height: 140 });
  });

  it("gives a one-point shape a visible default extent", () => {
    const bounds = getArtworkBounds([{
      tool: "circle",
      color: "#000",
      width: 2,
      points: [{ x: 10, y: 20 }],
    }]);
    expect(bounds?.width).toBe(144);
    expect(bounds?.height).toBe(144);
  });

  it("includes a blob's organic overshoot", () => {
    const bounds = getArtworkBounds([{
      tool: "blob",
      color: "#000",
      width: 2,
      points: [{ x: 0, y: 0 }, { x: 100, y: 80 }],
    }], 0);
    expect(bounds?.width).toBeGreaterThan(100);
    expect(bounds?.height).toBeGreaterThan(80);
  });
});
