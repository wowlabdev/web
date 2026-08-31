import type { Bounds, Viewport } from "../scene/types";

import { clampZoom } from "./transforms";

// Keeps at least `minVisibleFraction` of `panBounds` on screen so content can't drift away.
export function clampPan(
  viewport: Viewport,
  panBounds: Bounds,
  container: { width: number; height: number },
  minVisibleFraction = 0.25,
): Viewport {
  if (panBounds.width <= 0 || panBounds.height <= 0) {
    return viewport;
  }

  if (container.width <= 0 || container.height <= 0) {
    return viewport;
  }

  const { zoom } = viewport;
  const scaledW = panBounds.width * zoom;
  const scaledH = panBounds.height * zoom;
  const minVisibleW = Math.min(container.width, scaledW) * minVisibleFraction;
  const minVisibleH = Math.min(container.height, scaledH) * minVisibleFraction;

  // Pan is in screen pixels; scene coordinate p maps to (p * zoom + pan).
  const minPanX = minVisibleW - panBounds.x * zoom - scaledW;
  const maxPanX = container.width - minVisibleW - panBounds.x * zoom;
  const minPanY = minVisibleH - panBounds.y * zoom - scaledH;
  const maxPanY = container.height - minVisibleH - panBounds.y * zoom;

  const clampedX =
    minPanX > maxPanX
      ? (minPanX + maxPanX) / 2
      : Math.min(Math.max(viewport.pan.x, minPanX), maxPanX);
  const clampedY =
    minPanY > maxPanY
      ? (minPanY + maxPanY) / 2
      : Math.min(Math.max(viewport.pan.y, minPanY), maxPanY);

  if (clampedX === viewport.pan.x && clampedY === viewport.pan.y) {
    return viewport;
  }

  return { pan: { x: clampedX, y: clampedY }, zoom };
}

export function fitToBounds(
  sceneBounds: Bounds,
  container: { width: number; height: number },
  padding = 24,
): Viewport {
  if (
    sceneBounds.width <= 0 ||
    sceneBounds.height <= 0 ||
    container.width <= 0 ||
    container.height <= 0
  ) {
    return { pan: { x: 0, y: 0 }, zoom: 1 };
  }

  const availableW = Math.max(container.width - padding * 2, 1);
  const availableH = Math.max(container.height - padding * 2, 1);
  const zoom = clampZoom(
    Math.min(availableW / sceneBounds.width, availableH / sceneBounds.height),
  );

  const sceneCenterX = sceneBounds.x + sceneBounds.width / 2;
  const sceneCenterY = sceneBounds.y + sceneBounds.height / 2;

  return {
    pan: {
      x: container.width / 2 - sceneCenterX * zoom,
      y: container.height / 2 - sceneCenterY * zoom,
    },
    zoom,
  };
}
