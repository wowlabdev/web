"use client";

import { useMemoizedFn } from "ahooks";
import { type RefObject, useEffect, useMemo, useState } from "react";

import type { CanvasHandle } from "../konva/konva-canvas";
import type { AnnotationObject, Vec2 } from "../scene/types";

import { type AnnotationTool, createAnnotation } from "./annotation-builder";

export type HintState =
  | { kind: "pathRemaining"; count: number }
  | { kind: "pathFinish"; count: number }
  | { kind: "polygonRemaining"; count: number }
  | { kind: "polygonFinish"; count: number }
  | { kind: "pathStart" }
  | { kind: "polygonStart" };

export type Mode =
  | { kind: "idle" }
  | { kind: "drawing"; tool: "path" | "polygon"; points: ReadonlyArray<Vec2> }
  | {
      kind: "text";
      value: string;
      clientX: number;
      clientY: number;
      scenePoint: Vec2;
    };

export function useAnnotationDrawing(args: {
  tool: AnnotationTool;
  color: string;
  annotationLayerId: string;
  canvasRef: RefObject<CanvasHandle | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  commit: (annotation: AnnotationObject) => void;
  onPreviewChange?: (preview: AnnotationObject | null) => void;
}): {
  mode: Mode;
  setMode: (mode: Mode) => void;
  hint: HintState | null;
  handlePointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  submitText: () => void;
  isDrawing: boolean;
} {
  const {
    annotationLayerId,
    canvasRef,
    color,
    commit,
    containerRef,
    onPreviewChange,
    tool,
  } = args;

  const [mode, setMode] = useState<Mode>({ kind: "idle" });

  const isDrawing = tool !== "select";

  const toScene = useMemoizedFn(
    (event: React.PointerEvent<HTMLDivElement>): Vec2 | null => {
      const handle = canvasRef.current;

      if (!handle) {
        return null;
      }

      return handle.clientToScene({ x: event.clientX, y: event.clientY });
    },
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) {
      return;
    }

    const point = toScene(event);

    if (!point) {
      return;
    }

    event.preventDefault();

    if (tool === "marker") {
      const annotation = createAnnotation({
        color,
        draft: { points: [point], tool: "marker" },
        layerId: annotationLayerId,
      });

      if (annotation) {
        commit(annotation);
      }

      return;
    }

    if (tool === "text") {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();

      setMode({
        clientX: event.clientX - rect.left,
        clientY: event.clientY - rect.top,
        kind: "text",
        scenePoint: point,
        value: "",
      });

      return;
    }

    setMode((prev) => {
      if (prev.kind === "drawing" && prev.tool === tool) {
        return { ...prev, points: [...prev.points, point] };
      }

      return { kind: "drawing", points: [point], tool };
    });
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode.kind !== "drawing") {
      return;
    }

    event.preventDefault();
    const annotation = createAnnotation({
      color,
      draft: { points: mode.points, tool: mode.tool },
      layerId: annotationLayerId,
    });

    if (annotation) {
      commit(annotation);
    }

    setMode({ kind: "idle" });
  };

  const submitText = () => {
    if (mode.kind !== "text") {
      return;
    }

    const trimmed = mode.value.trim();

    if (trimmed.length === 0) {
      setMode({ kind: "idle" });

      return;
    }

    const annotation = createAnnotation({
      color,
      draft: { points: [mode.scenePoint], text: trimmed, tool: "text" },
      layerId: annotationLayerId,
    });

    if (annotation) {
      commit(annotation);
    }

    setMode({ kind: "idle" });
  };

  const hint = useMemo<HintState | null>(() => {
    if (mode.kind === "drawing") {
      const isPolygon = mode.tool === "polygon";
      const min = isPolygon ? 3 : 2;
      const remaining = Math.max(0, min - mode.points.length);

      if (remaining > 0) {
        return isPolygon
          ? { count: remaining, kind: "polygonRemaining" }
          : { count: remaining, kind: "pathRemaining" };
      }

      return isPolygon
        ? { count: mode.points.length, kind: "polygonFinish" }
        : { count: mode.points.length, kind: "pathFinish" };
    }

    if (tool === "path") {
      return { kind: "pathStart" };
    }

    if (tool === "polygon") {
      return { kind: "polygonStart" };
    }

    return null;
  }, [mode, tool]);

  // TODO: dedupe with createAnnotation — preview downgrades shape by point count (polygon <3 → path, path <2 → marker), which createAnnotation doesn't model.
  const previewAnnotation = useMemo<AnnotationObject | null>(() => {
    if (mode.kind !== "drawing") {
      return null;
    }

    const points = mode.points;

    if (points.length === 0) {
      return null;
    }

    const baseStyle = {
      fill: color,
      opacity: 0.7,
      stroke: color,
      strokeWidth: 2,
    };

    if (mode.tool === "polygon" && points.length >= 3) {
      return {
        id: "annot-preview",
        kind: "annotation",
        layerId: annotationLayerId,
        points,
        shape: "polygon",
        style: { ...baseStyle, opacity: 0.25 },
      };
    }

    if (points.length >= 2) {
      return {
        id: "annot-preview",
        kind: "annotation",
        layerId: annotationLayerId,
        points,
        shape: "path",
        style: baseStyle,
      };
    }

    return {
      id: "annot-preview",
      kind: "annotation",
      layerId: annotationLayerId,
      position: points[0],
      shape: "marker",
      style: baseStyle,
    };
  }, [mode, color, annotationLayerId]);

  useEffect(() => {
    onPreviewChange?.(previewAnnotation);
  }, [previewAnnotation, onPreviewChange]);

  return {
    handleDoubleClick,
    handlePointerDown,
    hint,
    isDrawing,
    mode,
    setMode,
    submitText,
  };
}
