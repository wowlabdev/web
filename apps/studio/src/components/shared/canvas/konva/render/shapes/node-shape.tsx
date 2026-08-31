"use client";

import { Circle, Rect, RegularPolygon } from "react-konva";

import type {
  NodeObject,
  ObjectId,
} from "@/components/shared/canvas/scene/types";

import {
  type Handlers,
  selectedStroke,
  withSelectHandlers,
} from "../shape-helpers";

type NodeShapeProps = {
  obj: NodeObject;
  handlers: Handlers;
  selectedId: ObjectId | null;
};

export function NodeShape({
  handlers,
  obj,
  selectedId,
}: Readonly<NodeShapeProps>) {
  const size = obj.style?.size ?? 12;
  const fill = obj.style?.fill ?? "#1f2937";
  const isSelected = obj.id === selectedId;
  const { stroke, strokeWidth } = selectedStroke(
    isSelected,
    "#94a3b8",
    obj.style?.stroke,
    1,
    obj.style?.strokeWidth,
  );
  const opacity = obj.style?.opacity ?? 1;
  const shape = obj.style?.shape ?? "circle";
  const select = withSelectHandlers(obj, handlers);
  const listening = obj.isSelectable ? undefined : false;

  switch (shape) {
    case "diamond": {
      return (
        <RegularPolygon
          x={obj.position.x}
          y={obj.position.y}
          sides={4}
          radius={size}
          rotation={45}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          listening={listening}
          {...select}
        />
      );
    }

    case "hex": {
      return (
        <RegularPolygon
          x={obj.position.x}
          y={obj.position.y}
          sides={6}
          radius={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          listening={listening}
          {...select}
        />
      );
    }

    case "square": {
      return (
        <Rect
          x={obj.position.x - size}
          y={obj.position.y - size}
          width={size * 2}
          height={size * 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          listening={listening}
          {...select}
        />
      );
    }

    default: {
      return (
        <Circle
          x={obj.position.x}
          y={obj.position.y}
          radius={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          listening={listening}
          {...select}
        />
      );
    }
  }
}
