"use client";

import { useMemo } from "react";

import type { Viewport } from "../scene/types";

export type VisibleRect = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

// Visible scene rect with ~1 viewport overscan; used to cull off-screen image/tile objects.
export function useVisibleRect(args: {
  viewport: Viewport | null;
  width: number;
  height: number;
}): VisibleRect | null {
  const { height, viewport, width } = args;

  return useMemo(() => {
    if (!viewport || width <= 0 || height <= 0) {
      return null;
    }

    const padX = width / viewport.zoom;
    const padY = height / viewport.zoom;

    return {
      maxX: (-viewport.pan.x + width) / viewport.zoom + padX,
      maxY: (-viewport.pan.y + height) / viewport.zoom + padY,
      minX: -viewport.pan.x / viewport.zoom - padX,
      minY: -viewport.pan.y / viewport.zoom - padY,
    };
  }, [viewport, width, height]);
}
