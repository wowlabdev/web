import type { Bounds, Vec2, Viewport } from "../scene/types";

import { ZOOM_STEP } from "./constants";
import { clampPan } from "./fit";
import { clampZoom } from "./transforms";

export function pointerZoom(
  current: Viewport,
  pointer: Vec2,
  deltaY: number,
  modifier: {
    ctrlKey?: boolean;
    panBounds?: Bounds;
    container?: { width: number; height: number };
  } = {},
): Viewport {
  // Pinch and wheel both ride on deltaY's sign, so ctrlKey is intentionally unused.
  void modifier.ctrlKey;

  const oldScale = current.zoom;
  const sceneX = (pointer.x - current.pan.x) / oldScale;
  const sceneY = (pointer.y - current.pan.y) / oldScale;

  const direction = deltaY > 0 ? -1 : 1;

  const target = direction > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP;
  const newScale = clampZoom(target);

  const next: Viewport = {
    pan: {
      x: pointer.x - sceneX * newScale,
      y: pointer.y - sceneY * newScale,
    },
    zoom: newScale,
  };

  if (modifier.panBounds && modifier.container) {
    return clampPan(next, modifier.panBounds, modifier.container);
  }

  return next;
}
