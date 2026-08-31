"use client";

import { useMemoizedFn } from "ahooks";
import { type RefObject } from "react";

import type { CanvasHandle } from "../konva/konva-canvas";

import { EXPORT_PIXEL_RATIO } from "../viewport/constants";

export function useCanvasExport(args: {
  canvasRef: RefObject<CanvasHandle | null>;
  fileName: string;
}): { exportPng: () => Promise<void> } {
  const { canvasRef, fileName } = args;

  const exportPng = useMemoizedFn(async () => {
    const handle = canvasRef.current;

    if (!handle) {
      return;
    }

    const blob = await handle.exportPng({ pixelRatio: EXPORT_PIXEL_RATIO });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });

  return { exportPng };
}
