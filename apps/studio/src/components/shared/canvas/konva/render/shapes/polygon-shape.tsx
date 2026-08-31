"use client";

import { Line } from "react-konva";

import type {
  ObjectId,
  PolygonObject,
} from "@/components/shared/canvas/scene/types";

import {
  flatten,
  type Handlers,
  selectedStroke,
  SHAPE_PERF,
  withSelectHandlers,
} from "../shape-helpers";

type PolygonShapeProps = {
  obj: PolygonObject;
  handlers: Handlers;
  selectedId: ObjectId | null;
};

export function PolygonShape({
  handlers,
  obj,
  selectedId,
}: Readonly<PolygonShapeProps>) {
  const isSelected = obj.id === selectedId;
  const { stroke, strokeWidth } = selectedStroke(
    isSelected,
    "#94a3b8",
    obj.style?.stroke,
    1,
    obj.style?.strokeWidth,
  );
  const select = withSelectHandlers(obj, handlers);

  return (
    <Line
      points={flatten(obj.points)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={obj.style?.fill}
      opacity={obj.style?.opacity ?? 1}
      closed
      listening={obj.isSelectable ? undefined : false}
      {...SHAPE_PERF}
      {...select}
    />
  );
}
