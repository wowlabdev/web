import type { Bounds, ObjectId, SceneObject, Vec2 } from "./types";

export function boundsFromPoints(points: ReadonlyArray<Vec2>): Bounds {
  if (points.length === 0) {
    return { height: 0, width: 0, x: 0, y: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) {
      minX = p.x;
    }

    if (p.y < minY) {
      minY = p.y;
    }

    if (p.x > maxX) {
      maxX = p.x;
    }

    if (p.y > maxY) {
      maxY = p.y;
    }
  }

  return { height: maxY - minY, width: maxX - minX, x: minX, y: minY };
}

export function indexObjects(
  objects: ReadonlyArray<SceneObject>,
): Map<ObjectId, SceneObject> {
  const map = new Map<ObjectId, SceneObject>();

  for (const obj of objects) {
    map.set(obj.id, obj);
  }

  return map;
}
