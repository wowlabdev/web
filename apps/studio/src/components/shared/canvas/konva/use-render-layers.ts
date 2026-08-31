"use client";

import { useMemo } from "react";

import type {
  AnnotationObject,
  CanvasScene,
  ObjectId,
  SceneObject,
  Vec2,
} from "../scene/types";
import type { VisibleRect } from "./use-visible-rect";

type UseRenderLayersOptions = {
  annotations?: ReadonlyArray<AnnotationObject>;
  hiddenLayerIds?: ReadonlyArray<string>;
  scene: CanvasScene;
  visibleRect: null | VisibleRect;
};

export function useRenderLayers({
  annotations,
  hiddenLayerIds,
  scene,
  visibleRect,
}: UseRenderLayersOptions) {
  const positions = useMemo(() => {
    const map = new Map<ObjectId, Vec2>();

    for (const object of scene.objects) {
      if (object.kind === "node") {
        map.set(object.id, object.position);
      }
    }

    return map;
  }, [scene.objects]);
  const hiddenLayers = useMemo(() => new Set(hiddenLayerIds), [hiddenLayerIds]);
  const visibleLayers = useMemo(
    () =>
      scene.layers
        .filter(
          (layer) => layer.isVisible !== false && !hiddenLayers.has(layer.id),
        )
        .sort((left, right) => left.z - right.z),
    [scene.layers, hiddenLayers],
  );
  const objectsByLayer = useMemo(() => {
    const map = new Map<string, SceneObject[]>(
      visibleLayers.map((layer) => [layer.id, []]),
    );

    for (const object of scene.objects) {
      const bucket = map.get(object.layerId);

      if (!bucket || isImageCulled(object, visibleRect)) {
        continue;
      }

      bucket.push(object);
    }

    for (const annotation of annotations ?? []) {
      map.get(annotation.layerId)?.push(annotation);
    }

    return map;
  }, [annotations, scene.objects, visibleLayers, visibleRect]);

  return { objectsByLayer, positions, visibleLayers };
}

function isImageCulled(
  object: SceneObject,
  visibleRect: null | VisibleRect,
): boolean {
  if (object.kind !== "image" || !visibleRect) {
    return false;
  }

  const maxX = object.position.x + object.size.width;
  const maxY = object.position.y + object.size.height;

  return (
    maxX < visibleRect.minX ||
    maxY < visibleRect.minY ||
    object.position.x > visibleRect.maxX ||
    object.position.y > visibleRect.maxY
  );
}
