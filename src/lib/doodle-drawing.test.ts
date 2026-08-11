import { describe, expect, it } from "vitest";
import { appendDrawingPoint, createDrawingAction } from "./doodle-drawing";

const start = { x: 10, y: 20 };

describe("doodle drawing transitions", () => {
  it("accumulates points for a freehand pen stroke", () => {
    const action = createDrawingAction({
      point: start,
      tool: "pen",
      color: "#191a1c",
      width: 2,
      portraitBound: true,
    });
    const next = appendDrawingPoint(action, { x: 30, y: 40 });
    expect(next.points).toEqual([start, { x: 30, y: 40 }]);
    expect(next.portraitBound).toBe(true);
  });

  it.each(["circle", "square", "triangle", "blob"] as const)(
    "keeps a start and current endpoint for a %s gesture",
    (tool) => {
      const action = createDrawingAction({
        point: start,
        tool,
        color: "#3d5b57",
        width: 4,
        portraitBound: false,
        shapeSeed: 0.42,
      });
      const moved = appendDrawingPoint(action, { x: 30, y: 40 });
      const movedAgain = appendDrawingPoint(moved, { x: 50, y: 60 });
      expect(movedAgain.points).toEqual([start, { x: 50, y: 60 }]);
      expect(movedAgain.shapeSeed).toBe(tool === "blob" ? 0.42 : undefined);
    },
  );
});
