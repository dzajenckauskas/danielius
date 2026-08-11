export type ScrollThreadPoint = {
  x: number;
  y: number;
  loops?: number;
  radius?: number;
};

function connect(
  path: string,
  from: ScrollThreadPoint,
  to: ScrollThreadPoint,
  character: number,
) {
  const distance = Math.max(to.y - from.y, 80);
  const sway = (character - 0.5) * 32;
  return `${path} C ${from.x + sway} ${from.y + distance * 0.34}, `
    + `${to.x - sway * 0.35} ${to.y - distance * 0.24}, ${to.x} ${to.y}`;
}

function addOrbit(
  path: string,
  center: ScrollThreadPoint,
  radius: number,
  character: number,
) {
  const lean = (character - 0.5) * radius * 0.5;
  const horizontal = radius * (0.82 + character * 0.3);
  const vertical = radius * (0.62 + (1 - character) * 0.28);
  const x = center.x;
  const y = center.y;
  const startX = x - radius * (0.94 + character * 0.1);

  return path
    + ` C ${x - horizontal * 1.08} ${y + vertical * 0.48}, ${x - horizontal * 0.42 + lean} ${y + vertical * 1.08}, ${x + horizontal * 0.12 + lean} ${y + vertical * 0.86}`
    + ` C ${x + horizontal * 0.72} ${y + vertical * 0.7}, ${x + horizontal * 1.06} ${y + vertical * 0.12}, ${x + horizontal * 0.82} ${y - vertical * 0.34}`
    + ` C ${x + horizontal * 0.58 - lean} ${y - vertical * 0.94}, ${x - horizontal * 0.12 - lean} ${y - vertical * 1.02}, ${x - horizontal * 0.66} ${y - vertical * 0.62}`
    + ` C ${x - horizontal * 1.04} ${y - vertical * 0.38}, ${x - horizontal * 1.12} ${y + vertical * 0.02}, ${startX} ${y}`;
}

export function buildScrollThreadPath(
  points: ScrollThreadPoint[],
  variation: number[],
) {
  if (points.length < 2) return "";
  let current = points[0];
  let path = `M ${current.x} ${current.y}`;

  points.slice(1).forEach((point, index) => {
    const character = variation[index % variation.length] ?? 0.5;
    const loopCount = point.loops ?? 0;

    if (loopCount > 0) {
      const radius = point.radius ?? 42;
      const orbitStart = {
        x: point.x - radius * (0.94 + character * 0.1),
        y: point.y,
      };
      path = connect(path, current, orbitStart, character);

      for (let loop = 0; loop < loopCount; loop += 1) {
        path = addOrbit(path, point, radius + loop * 8, character);
      }
      current = orbitStart;
      return;
    }

    path = connect(path, current, point, character);
    current = point;
  });

  return path;
}
