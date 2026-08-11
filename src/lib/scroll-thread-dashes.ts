const SPEED_SOLID = 500;
const SPEED_SKIM = 4000;
const DASH_BASE = 10;
const GAP_MAX = 20;

type ExtendDashPatternOptions = {
  pattern: number[];
  patternLength: number;
  targetLength: number;
  totalLength: number;
  speed: number;
  random?: () => number;
};

export function extendScrollThreadDashPattern({
  pattern,
  patternLength,
  targetLength,
  totalLength,
  speed,
  random = Math.random,
}: ExtendDashPatternOptions) {
  const skim = Math.max(
    0,
    Math.min(1, (speed - SPEED_SOLID) / (SPEED_SKIM - SPEED_SOLID)),
  );
  const baseGap = skim * GAP_MAX;
  const limit = Math.min(targetLength, totalLength + 40);

  while (patternLength < limit) {
    const roll = random();
    const gapMultiplier = roll < 0.12 ? 0 : 0.8 + random() * 0.4;
    const dash = DASH_BASE + skim * 8 + (random() - 0.5) * 2;
    const dashGap = baseGap * gapMultiplier < 1.5 ? 0 : baseGap * gapMultiplier;

    if (dashGap === 0 && pattern.length >= 2 && pattern.at(-1) === 0) {
      pattern[pattern.length - 2] += dash;
    } else {
      pattern.push(dash, dashGap);
    }
    patternLength += dash + dashGap;
  }

  return patternLength;
}
