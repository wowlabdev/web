export type ClipOptions = {
  curvature: number;
  shouldClipFromCircle: boolean;
  shouldClipToCircle: boolean;
};

export type Geometry = {
  height: number;
  pathD: string;
  scale: number;
  width: number;
};

type Point = { x: number; y: number };

export const EMPTY_GEOMETRY: Geometry = {
  height: 0,
  pathD: "",
  scale: 1,
  width: 0,
};

export function measureBeam(
  container: HTMLElement,
  from: HTMLElement | null,
  to: HTMLElement | null,
  { curvature, shouldClipFromCircle, shouldClipToCircle }: ClipOptions,
): Geometry {
  if (!from || !to) {
    return EMPTY_GEOMETRY;
  }

  const origin = container.getBoundingClientRect();
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const fromCenter = center(fromRect, origin);
  const toCenter = center(toRect, origin);
  const start = shouldClipFromCircle
    ? moveTowards(fromCenter, toCenter, inscribedRadius(fromRect))
    : fromCenter;
  const end = shouldClipToCircle
    ? moveTowards(toCenter, fromCenter, inscribedRadius(toRect))
    : toCenter;

  const fullDist = distance(fromCenter, toCenter);
  const controlY = start.y - curvature;

  return {
    height: origin.height,
    pathD: `M ${start.x},${start.y} Q ${(start.x + end.x) / 2},${controlY} ${end.x},${end.y}`,
    scale: fullDist > 0 ? distance(start, end) / fullDist : 1,
    width: origin.width,
  };
}

function center(rect: DOMRect, origin: DOMRect): Point {
  return {
    x: rect.left - origin.left + rect.width / 2,
    y: rect.top - origin.top + rect.height / 2,
  };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function inscribedRadius(rect: DOMRect): number {
  return Math.min(rect.width, rect.height) / 2;
}

function moveTowards(from: Point, to: Point, amount: number): Point {
  const d = distance(from, to) || 1;

  return {
    x: from.x + ((to.x - from.x) / d) * amount,
    y: from.y + ((to.y - from.y) / d) * amount,
  };
}
