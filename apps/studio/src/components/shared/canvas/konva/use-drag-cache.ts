"use client";

import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

import { type RefObject, useMemo } from "react";

import type { Bounds, Viewport } from "../scene/types";

import { clampPan } from "../viewport/fit";

export function useDragCache(args: {
  stageRef: RefObject<Konva.Stage | null>;
  viewport: Viewport | null;
  setViewport: (next: Viewport) => void;
  panBounds?: Bounds;
  viewportSize: { width: number; height: number };
}): {
  onDragStart: (event: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (event: KonvaEventObject<DragEvent>) => void;
} {
  const { panBounds, setViewport, stageRef, viewport, viewportSize } = args;

  return useMemo(
    () => ({
      onDragEnd(event: KonvaEventObject<DragEvent>) {
        const target = event.target;
        const stage = stageRef.current;

        if (!stage || target !== stage) {
          return;
        }

        for (const layer of stage.getLayers()) {
          if (layer.isCached()) {
            try {
              layer.clearCache();
            } catch {
              // ignore
            }
          }
        }

        if (!viewport) {
          return;
        }

        const next: Viewport = {
          ...viewport,
          pan: { x: stage.x(), y: stage.y() },
        };
        const clamped = panBounds
          ? clampPan(next, panBounds, viewportSize)
          : next;

        if (
          panBounds &&
          (clamped.pan.x !== next.pan.x || clamped.pan.y !== next.pan.y)
        ) {
          stage.x(clamped.pan.x);
          stage.y(clamped.pan.y);
        }

        setViewport(clamped);
        stage.batchDraw();
      },

      // Cache only listening layers during drag; the background tile layer is non-listening so caching it wastes GPU.
      onDragStart(event: KonvaEventObject<DragEvent>) {
        const stage = stageRef.current;

        if (!stage || event.target !== stage) {
          return;
        }

        for (const layer of stage.getLayers()) {
          if (!layer.listening()) {
            continue;
          }

          const rect = layer.getClientRect({ skipTransform: false });

          if (rect.width <= 0 || rect.height <= 0) {
            continue;
          }

          try {
            layer.cache({ pixelRatio: 1 });
          } catch {
            // ignore
          }
        }
      },
    }),
    [stageRef, viewport, setViewport, panBounds, viewportSize],
  );
}
