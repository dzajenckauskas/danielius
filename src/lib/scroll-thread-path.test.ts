import { describe, expect, it } from "vitest";
import { buildScrollThreadPath } from "@/lib/scroll-thread-path";

describe("buildScrollThreadPath", () => {
  it("returns no path until there are at least two points", () => {
    expect(buildScrollThreadPath([], [0.5])).toBe("");
    expect(buildScrollThreadPath([{ x: 10, y: 20 }], [0.5])).toBe("");
  });

  it("connects ordinary anchors with a cubic curve", () => {
    expect(buildScrollThreadPath([
      { x: 10, y: 20 },
      { x: 30, y: 120 },
    ], [0.5])).toBe("M 10 20 C 10 54, 30 96, 30 120");
  });

  it("adds the requested number of hand-drawn orbit segments", () => {
    const path = buildScrollThreadPath([
      { x: 10, y: 20 },
      { x: 100, y: 160, loops: 2, radius: 30 },
    ], [0.5]);

    expect(path.startsWith("M 10 20 C ")).toBe(true);
    expect(path.match(/ C /g)).toHaveLength(9);
    expect(path.endsWith(" 160")).toBe(true);
  });
});
