import { describe, expect, it } from "vitest";
import { extendScrollThreadDashPattern } from "@/lib/scroll-thread-dashes";

describe("extendScrollThreadDashPattern", () => {
  it("merges consecutive solid marks into one continuous dash", () => {
    const pattern = [10, 0];
    const patternLength = extendScrollThreadDashPattern({
      pattern,
      patternLength: 10,
      targetLength: 30,
      totalLength: 100,
      speed: 0,
      random: () => 0.5,
    });

    expect(pattern).toEqual([30, 0]);
    expect(patternLength).toBe(30);
  });

  it("adds visible gaps when the thread is moving quickly", () => {
    const pattern: number[] = [];
    extendScrollThreadDashPattern({
      pattern,
      patternLength: 0,
      targetLength: 20,
      totalLength: 100,
      speed: 4000,
      random: () => 0.5,
    });

    expect(pattern).toEqual([18, 20]);
  });
});
