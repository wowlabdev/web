import type { Vec2, Viewport } from "../scene/types";

import { ZOOM_MAX, ZOOM_MIN } from "./constants";

export function clampZoom(
  zoom: number,
  min = ZOOM_MIN,
  max = ZOOM_MAX,
): number {
  if (Number.isNaN(zoom)) {
    return min;
  }

  return Math.min(Math.max(zoom, min), max);
}

export function toScene(viewport: Viewport, pointer: Vec2): Vec2 {
  return {
    x: (pointer.x - viewport.pan.x) / viewport.zoom,
    y: (pointer.y - viewport.pan.y) / viewport.zoom,
  };
}
