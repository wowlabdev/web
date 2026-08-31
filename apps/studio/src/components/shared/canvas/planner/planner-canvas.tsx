"use client";

import { useMemo, useRef, useState } from "react";

import type { CanvasHandle, KonvaCanvasProps } from "../konva/konva-canvas";
import type { AnnotationObject } from "../scene/types";

import { CanvasView } from "../konva/canvas-view";
import { PlannerOverlay } from "./planner-overlay";
import {
  PlannerStoreProvider,
  usePlannerAnnotations,
} from "./planner-store-provider";

export type PlannerCanvasProps = {
  annotationLayerId: string;
  exportFileName: string;
} & Omit<KonvaCanvasProps, "ref" | "annotations">;

export function PlannerCanvas(props: PlannerCanvasProps) {
  return (
    <PlannerStoreProvider>
      <PlannerCanvasInner {...props} />
    </PlannerStoreProvider>
  );
}

function PlannerCanvasInner({
  annotationLayerId,
  exportFileName,
  scene,
  ...rest
}: PlannerCanvasProps) {
  const canvasRef = useRef<CanvasHandle | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const annotations = usePlannerAnnotations();
  const [preview, setPreview] = useState<AnnotationObject | null>(null);

  const annotationsForCanvas = useMemo<ReadonlyArray<AnnotationObject>>(
    () => (preview ? [...annotations, preview] : annotations),
    [annotations, preview],
  );

  return (
    <div ref={containerRef} className="relative size-full">
      <CanvasView
        {...rest}
        scene={scene}
        annotations={annotationsForCanvas}
        ref={canvasRef}
        className="absolute inset-0"
      />
      <PlannerOverlay
        canvasRef={canvasRef}
        containerRef={containerRef}
        onPreviewChange={setPreview}
        annotationLayerId={annotationLayerId}
        exportFileName={exportFileName}
      />
    </div>
  );
}
