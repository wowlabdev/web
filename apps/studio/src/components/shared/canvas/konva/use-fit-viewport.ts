"use client";

import { useMemo, useState } from "react";

import type { CanvasScene, Viewport } from "../scene/types";

import { fitToBounds } from "../viewport/fit";

export function useFitViewport(args: {
  scene: CanvasScene;
  width: number;
  height: number;
  initialViewport?: Viewport;
}): {
  viewport: Viewport | null;
  setViewport: (next: Viewport) => void;
} {
  const { height, initialViewport, scene, width } = args;
  const sceneId = scene.id;

  const fitted = useMemo<Viewport | null>(() => {
    if (width <= 0 || height <= 0) {
      return null;
    }

    if (initialViewport) {
      return initialViewport;
    }

    if (scene.initialViewport) {
      return scene.initialViewport;
    }

    return fitToBounds(scene.bounds, { height, width });
  }, [height, initialViewport, scene.bounds, scene.initialViewport, width]);

  // Reset user viewport on scene id change (render-time setState); width/height changes preserve pan/zoom.
  const [trackedSceneId, setTrackedSceneId] = useState(sceneId);
  const [userViewport, setUserViewport] = useState<Viewport | null>(null);

  if (trackedSceneId !== sceneId) {
    setTrackedSceneId(sceneId);
    setUserViewport(null);
  }

  const viewport = userViewport ?? fitted;

  return { setViewport: setUserViewport, viewport };
}
