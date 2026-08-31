"use client";

import { Line } from "react-konva";

import type {
  ObjectId,
  PathObject,
} from "@/components/shared/canvas/scene/types";

import {
  dashFor,
  flatten,
  type Handlers,
  selectedStroke,
  SHAPE_PERF,
  withSelectHandlers,
} from "../shape-helpers";

type PathShapeProps = {
  obj: PathObject;
  handlers: Handlers;
  selectedId: ObjectId | null;
};

export function PathShape({
  handlers,
  obj,
  selectedId,
}: Readonly<PathShapeProps>) {
  const isSelected = obj.id === selectedId;
  const { stroke, strokeWidth } = selectedStroke(
    isSelected,
    "#475569",
    obj.style?.stroke,
    2,
    obj.style?.strokeWidth,
  );
  const select = withSelectHandlers(obj, handlers);

  return (
    <Line
      points={flatten(obj.points)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dash={dashFor(obj.style)}
      opacity={obj.style?.opacity ?? 1}
      closed={obj.style?.isClosed ?? false}
      fill={obj.style?.fill}
      lineCap="round"
      lineJoin="round"
      listening={obj.isSelectable ? undefined : false}
      {...SHAPE_PERF}
      {...select}
    />
  );
}
