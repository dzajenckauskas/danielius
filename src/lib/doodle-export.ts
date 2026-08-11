import type { DrawingAction, Point } from "@/lib/doodle-canvas";

export type ArtworkBounds = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

function actionBoundsPoints(action: DrawingAction): Point[] {
  let points = action.points;
  if (action.tool !== "pen" && points.length === 1) {
    const start = points[0];
    points = [start, { x: start.x + 64, y: start.y + 64 }];
  }
  if (action.tool !== "blob") return points;

  const start = points[0];
  const end = points.at(-1) ?? start;
  const left = Math.min(start.x, end.x);
  const right = Math.max(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const bottom = Math.max(start.y, end.y);
  const overshootX = Math.max(12, right - left) * 0.1;
  const overshootY = Math.max(12, bottom - top) * 0.1;
  return [...points, { x: left - overshootX, y: top - overshootY }, { x: right + overshootX, y: bottom + overshootY }];
}

export function getArtworkBounds(actions: DrawingAction[], padding = 40): ArtworkBounds | null {
  if (!actions.length) return null;
  const points = actions.flatMap(actionBoundsPoints);
  if (!points.length) return null;
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  return {
    minX,
    minY,
    width: Math.max(1, maxX - minX + padding * 2),
    height: Math.max(1, maxY - minY + padding * 2),
  };
}
