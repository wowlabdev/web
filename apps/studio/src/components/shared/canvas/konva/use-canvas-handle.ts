"use client";

import type Konva from "konva";

import { type Ref, type RefObject, useImperativeHandle } from "react";

import type { Viewport } from "../scene/types";
import type { CanvasHandle } from "./konva-canvas";

import { EXPORT_PIXEL_RATIO } from "../viewport/constants";
import { toScene } from "../viewport/transforms";

export function useCanvasHandle(args: {
  ref: Ref<CanvasHandle> | undefined;
  stageRef: RefObject<Konva.Stage | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  viewport: Viewport | null;
}): void {
  const { containerRef, ref, stageRef, viewport } = args;

  useImperativeHandle(
    ref,
    () => ({
      clientToScene(clientPoint) {
        const stage = stageRef.current;
        const container = containerRef.current;

        if (!stage || !container || !viewport) {
          return null;
        }

        const rect = container.getBoundingClientRect();
        const stageX = clientPoint.x - rect.left;
        const stageY = clientPoint.y - rect.top;

        return toScene(viewport, { x: stageX, y: stageY });
      },
      async exportPng(options) {
        const stage = stageRef.current;

        if (!stage) {
          throw new Error("Stage is not mounted");
        }

        const dataUrl = stage.toDataURL({
          mimeType: options?.mimeType ?? "image/png",
          pixelRatio: options?.pixelRatio ?? EXPORT_PIXEL_RATIO,
          quality: options?.quality,
        });
        const response = await fetch(dataUrl);

        return response.blob();
      },
    }),
    [containerRef, stageRef, viewport],
  );
}
