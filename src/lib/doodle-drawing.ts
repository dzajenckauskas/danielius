import type { DrawingAction, Point, Tool } from "@/lib/doodle-canvas";

type CreateDrawingActionOptions = {
  point: Point;
  tool: Tool;
  color: string;
  width: number;
  portraitBound: boolean;
  shapeSeed?: number;
};

export function createDrawingAction({
  point,
  tool,
  color,
  width,
  portraitBound,
  shapeSeed = Math.random(),
}: CreateDrawingActionOptions): DrawingAction {
  return {
    tool,
    color,
    width,
    points: [point],
    shapeSeed: tool === "blob" ? shapeSeed : undefined,
    portraitBound,
  };
}

export function appendDrawingPoint(action: DrawingAction, point: Point): DrawingAction {
  return {
    ...action,
    points: action.tool === "pen" ? [...action.points, point] : [action.points[0], point],
  };
}
