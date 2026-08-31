"use client";

import type { KonvaEventObject } from "konva/lib/Node";

import { useSize } from "ahooks";
import Konva from "konva";
import { type Ref, useRef } from "react";
import { Stage } from "react-konva";

import type {
  AnnotationObject,
  CanvasScene,
  ObjectId,
  Vec2,
  Viewport,
} from "../scene/types";

import { pointerZoom } from "../viewport/pointer-zoom";
import { KonvaLayer } from "./konva-layer";
import { useCanvasHandle } from "./use-canvas-handle";
import { useDragCache } from "./use-drag-cache";
import { useFitViewport } from "./use-fit-viewport";
import { useKonvaBootstrap } from "./use-konva-bootstrap";
import { useRenderLayers } from "./use-render-layers";
import { useVisibleRect } from "./use-visible-rect";

export type CanvasHandle = {
  exportPng: (options?: ExportPngOptions) => Promise<Blob>;
  clientToScene: (clientPoint: { x: number; y: number }) => Vec2 | null;
};

export type ExportPngOptions = {
  pixelRatio?: number;
  mimeType?: "image/png" | "image/jpeg";
  quality?: number;
};

export type KonvaCanvasProps = {
  scene: CanvasScene;
  annotations?: ReadonlyArray<AnnotationObject>;
  selectedId?: ObjectId | null;
  onSelect?: (id: ObjectId | null) => void;
  hiddenLayerIds?: ReadonlyArray<string>;
  initialViewport?: Viewport;
  className?: string;
  width?: number;
  height?: number;
  ref?: Ref<CanvasHandle>;
};

export function KonvaCanvas({
  annotations,
  className,
  height: propHeight,
  hiddenLayerIds,
  initialViewport,
  onSelect,
  ref,
  scene,
  selectedId = null,
  width: propWidth,
}: Readonly<KonvaCanvasProps>) {
  useKonvaBootstrap();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  const measured = useSize(containerRef);
  const width = propWidth ?? measured?.width ?? 0;
  const height = propHeight ?? measured?.height ?? 0;

  const { setViewport, viewport } = useFitViewport({
    height,
    initialViewport,
    scene,
    width,
  });

  useCanvasHandle({ containerRef, ref, stageRef, viewport });

  const visibleRect = useVisibleRect({ height, viewport, width });
  const { objectsByLayer, positions, visibleLayers } = useRenderLayers({
    annotations,
    hiddenLayerIds,
    scene,
    visibleRect,
  });

  const { onDragEnd, onDragStart } = useDragCache({
    panBounds: scene.panBounds,
    setViewport,
    stageRef,
    viewport,
    viewportSize: { height, width },
  });

  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();
    const stage = stageRef.current;

    if (!stage || !viewport) {
      return;
    }

    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    setViewport(
      pointerZoom(viewport, pointer, event.evt.deltaY, {
        container: { height, width },
        ctrlKey: event.evt.ctrlKey,
        panBounds: scene.panBounds,
      }),
    );
  };

  const handleStageClick = (
    event: KonvaEventObject<MouseEvent | TouchEvent>,
  ) => {
    if (!onSelect) {
      return;
    }

    if (event.target instanceof Konva.Stage) {
      onSelect(null);
    }
  };

  const isReady = viewport !== null && width > 0 && height > 0;

  return (
    <div ref={containerRef} className={className}>
      {isReady ? (
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          x={viewport.pan.x}
          y={viewport.pan.y}
          scaleX={viewport.zoom}
          scaleY={viewport.zoom}
          draggable
          onWheel={handleWheel}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {visibleLayers.map((layer) => (
            <KonvaLayer
              key={layer.id}
              layer={layer}
              objects={objectsByLayer.get(layer.id) ?? []}
              positions={positions}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </Stage>
      ) : null}
    </div>
  );
}
