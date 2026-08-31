"use client";

import type {
  TimelineGeometry,
  TimelineMetrics,
  TimelineViewport,
} from "wowlab-common";

import { useEventListener, useMemoizedFn } from "ahooks";
import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCommon } from "@/components/shared/wasm";
import {
  computeTimelineMetrics,
  panTimelineBy,
  zoomTimelineAt,
} from "@/lib/wasm/api";

const WHEEL_ZOOM_FACTOR = 1.15;

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 200;
export const RIGHT_GUTTER = 8;

type UseTimelineViewportInput = {
  containerRef: RefObject<HTMLDivElement | null>;
  containerWidth: number;
  durationMs: number;
  gutterWidth: number;
  onViewportChange?: (viewport: TimelineViewport) => void;
  viewport?: TimelineViewport;
};

export function useTimelineViewport({
  containerRef,
  containerWidth,
  durationMs,
  gutterWidth,
  onViewportChange,
  viewport: controlledViewport,
}: UseTimelineViewportInput) {
  const common = useCommon();
  const [uncontrolledViewport, setUncontrolledViewport] =
    useState<TimelineViewport>(() => ({ panMs: 0, zoom: MIN_ZOOM }));
  const viewport = controlledViewport ?? uncontrolledViewport;
  const commitViewport = useMemoizedFn((next: TimelineViewport) => {
    if (onViewportChange) {
      onViewportChange(next);
    }

    if (!controlledViewport) {
      setUncontrolledViewport(next);
    }
  });

  const geometry = useMemo<TimelineGeometry>(
    () => ({
      containerWidth,
      durationMs,
      gutterWidth,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      panMs: viewport.panMs,
      rightGutter: RIGHT_GUTTER,
      zoom: viewport.zoom,
    }),
    [containerWidth, durationMs, gutterWidth, viewport.panMs, viewport.zoom],
  );
  const metrics: TimelineMetrics = useMemo(
    () => computeTimelineMetrics(common, geometry),
    [common, geometry],
  );
  const { clampedPanMs, safeZoom, trackWidth } = metrics;

  useEventListener(
    "wheel",
    (ev: WheelEvent) => {
      if (!containerRef.current || trackWidth <= 0 || durationMs <= 0) {
        return;
      }

      ev.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const localX = ev.clientX - rect.left - gutterWidth;

      if (localX < 0 || localX > trackWidth) {
        return;
      }

      commitViewport(
        zoomTimelineAt(
          common,
          geometry,
          localX,
          ev.deltaY <= 0,
          WHEEL_ZOOM_FACTOR,
        ),
      );
    },
    { passive: false, target: containerRef },
  );

  const dragRef = useRef<null | { startPanMs: number; startX: number }>(null);
  const onPointerDown = useMemoizedFn(
    (ev: ReactPointerEvent<HTMLDivElement>) => {
      if (ev.button !== 0 || trackWidth <= 0) {
        return;
      }

      dragRef.current = { startPanMs: clampedPanMs, startX: ev.clientX };
      ev.currentTarget.setPointerCapture(ev.pointerId);
    },
  );
  const onPointerMove = useMemoizedFn(
    (ev: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || trackWidth <= 0) {
        return;
      }

      const dx = ev.clientX - dragRef.current.startX;

      commitViewport(
        panTimelineBy(common, geometry, dragRef.current.startPanMs, dx),
      );
    },
  );
  const endDrag = useMemoizedFn((ev: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }

    dragRef.current = null;

    if (ev.currentTarget.hasPointerCapture(ev.pointerId)) {
      ev.currentTarget.releasePointerCapture(ev.pointerId);
    }
  });

  const reset = useMemoizedFn(() =>
    commitViewport({ panMs: 0, zoom: MIN_ZOOM }),
  );
  const isFit = safeZoom <= MIN_ZOOM && clampedPanMs <= 0;

  return { endDrag, isFit, metrics, onPointerDown, onPointerMove, reset };
}
