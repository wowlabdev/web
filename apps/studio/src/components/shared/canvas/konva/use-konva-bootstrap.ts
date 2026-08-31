"use client";

import { useMount } from "ahooks";
import Konva from "konva";

let bootstrapped = false;

export function useKonvaBootstrap() {
  useMount(() => {
    if (bootstrapped) {
      return;
    }

    bootstrapped = true;

    if (typeof window !== "undefined") {
      // Cap rasterization at 1.5× on retina; slightly softer text, ~2× cheaper redraws.
      Konva.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    }
  });
}
