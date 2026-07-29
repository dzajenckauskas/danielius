// Pure canvas-drawing logic for the doodle studio, kept free of React/DOM
// state so it can be unit tested and reused by both the live canvas and the
// export/composite renderers in DoodleLayer.tsx.

export type Point = { x: number; y: number };
export type Tool = "pen" | "blob" | "circle" | "square" | "triangle";
export type DrawingAction = {
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
  smooth?: boolean;
  closed?: boolean;
  fillColor?: string;
  rotation?: number;
  shapeSeed?: number;
  portraitBound?: boolean;
};

export function seededRandom(seed: number, offset: number) {
  const value = Math.sin((seed + offset) * 12_989.8) * 43_758.5453;
  return value - Math.floor(value);
}

/** Deterministic blob outline points for a given seed and bounding box. */
export function blobPoints(seed: number, left: number, top: number, width: number, height: number) {
  const vary = (offset: number, min: number, max: number) => (
    min + seededRandom(seed, offset) * (max - min)
  );
  const pointCount = Math.floor(vary(1, 6, 11));
  const lobeCount = Math.floor(vary(2, 2, 5));
  const lobeDepth = vary(3, 0.1, 0.3);
  const phase = vary(4, 0, Math.PI * 2);
  const angleStep = (Math.PI * 2) / pointCount;
  const centerX = left + width * vary(5, 0.46, 0.54);
  const centerY = top + height * vary(6, 0.46, 0.54);
  const radiusX = width * vary(7, 0.43, 0.5);
  const radiusY = height * vary(8, 0.43, 0.5);

  return Array.from({ length: pointCount }, (_, index) => {
    const baseAngle = phase + index * angleStep;
    const angle = baseAngle + vary(20 + index, -angleStep * 0.16, angleStep * 0.16);
    const lobe = Math.sin(baseAngle * lobeCount + phase) * lobeDepth;
    const radialJitter = vary(40 + index, -0.2, 0.2);
    const radius = 0.88 + lobe + radialJitter;

    return {
      x: centerX + Math.cos(angle) * radiusX * radius,
      y: centerY + Math.sin(angle) * radiusY * radius,
    };
  });
}

export function drawAction(context: CanvasRenderingContext2D, action: DrawingAction, progress = 1) {
  const [start, ...rest] = action.points;
  if (!start) return;

  context.save();
  context.strokeStyle = action.color;
  context.fillStyle = action.color;
  context.lineWidth = action.width;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (progress < 1) {
    const openLength = action.points.slice(1).reduce((length, current, index) => {
      const previous = action.points[index];
      return length + Math.hypot(current.x - previous.x, current.y - previous.y);
    }, 0);
    const closingLength = action.closed && action.points.length > 1
      ? Math.hypot(start.x - action.points.at(-1)!.x, start.y - action.points.at(-1)!.y)
      : 0;
    const pathLength = Math.max(openLength + closingLength, 1);
    context.setLineDash([pathLength, pathLength]);
    context.lineDashOffset = pathLength * (1 - Math.max(0, progress));
  }
  context.beginPath();

  if (action.tool === "pen") {
    context.moveTo(start.x, start.y);
    if (action.points.length === 1) {
      context.lineTo(start.x + 0.1, start.y + 0.1);
    } else if (action.points.length === 2 || action.smooth === false) {
      rest.forEach((point) => context.lineTo(point.x, point.y));
    } else {
      for (let index = 1; index < action.points.length - 1; index += 1) {
        const current = action.points[index];
        const next = action.points[index + 1];
        context.quadraticCurveTo(
          current.x,
          current.y,
          (current.x + next.x) / 2,
          (current.y + next.y) / 2,
        );
      }
      const end = action.points.at(-1)!;
      context.quadraticCurveTo(end.x, end.y, end.x, end.y);
    }
    if (action.closed) context.closePath();
    if (action.fillColor) {
      context.save();
      context.fillStyle = action.fillColor;
      context.globalAlpha *= Math.max(0, Math.min(1, (progress - 0.65) / 0.35));
      context.fill();
      context.restore();
    }
    context.stroke();
    context.restore();
    return;
  }

  const end = rest.at(-1) ?? { x: start.x + 64, y: start.y + 64 };
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.max(Math.abs(end.x - start.x), 12);
  const height = Math.max(Math.abs(end.y - start.y), 12);

  if (action.tool === "blob") {
    const seed = action.shapeSeed ?? 0.5;
    const tension = seededRandom(seed, 9) * (1.08 - 0.72) + 0.72;
    const points = blobPoints(seed, left, top, width, height);
    const pointCount = points.length;

    context.globalAlpha = 0.58;
    context.moveTo(points[0].x, points[0].y);
    points.forEach((current, index) => {
      const previous = points[(index - 1 + pointCount) % pointCount];
      const next = points[(index + 1) % pointCount];
      const afterNext = points[(index + 2) % pointCount];
      const controlOne = {
        x: current.x + ((next.x - previous.x) / 6) * tension,
        y: current.y + ((next.y - previous.y) / 6) * tension,
      };
      const controlTwo = {
        x: next.x - ((afterNext.x - current.x) / 6) * tension,
        y: next.y - ((afterNext.y - current.y) / 6) * tension,
      };
      context.bezierCurveTo(
        controlOne.x,
        controlOne.y,
        controlTwo.x,
        controlTwo.y,
        next.x,
        next.y,
      );
    });
    context.closePath();
    context.fill();
  } else if (action.tool === "circle") {
    context.ellipse(left + width / 2, top + height / 2, width / 2, height / 2, action.rotation ?? -0.04, 0, Math.PI * 2);
    context.stroke();
  } else if (action.tool === "square") {
    context.roundRect(left, top, width, height, Math.min(18, width / 5, height / 5));
    context.stroke();
  } else {
    context.moveTo(left + width / 2, top);
    context.lineTo(left + width, top + height);
    context.lineTo(left, top + height);
    context.closePath();
    context.stroke();
  }
  context.restore();
}
