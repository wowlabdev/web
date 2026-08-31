"use client";

import { Circle, Group, Line, Text } from "react-konva";

import type {
  AnnotationObject,
  ObjectId,
} from "@/components/shared/canvas/scene/types";

import {
  flatten,
  type Handlers,
  selectedStroke,
  SHAPE_PERF,
  withSelectHandlers,
} from "../shape-helpers";

type AnnotationShapeProps = {
  obj: AnnotationObject;
  handlers: Handlers;
  selectedId: ObjectId | null;
};

export function AnnotationShape({
  handlers,
  obj,
  selectedId,
}: Readonly<AnnotationShapeProps>) {
  const select = withSelectHandlers(obj, handlers);
  const isSelected = obj.id === selectedId;

  if (obj.shape === "marker" && obj.position) {
    const radius = (obj.style?.strokeWidth ?? 2) * 4;
    const { stroke, strokeWidth } = selectedStroke(
      isSelected,
      "#1f2937",
      obj.style?.stroke,
      1,
    );

    return (
      <Group {...select}>
        <Circle
          x={obj.position.x}
          y={obj.position.y}
          radius={radius}
          fill={obj.style?.fill ?? "#fbbf24"}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={obj.style?.opacity ?? 1}
          {...SHAPE_PERF}
        />
        {obj.text ? (
          <Text
            x={obj.position.x + radius + 4}
            y={obj.position.y - radius}
            text={obj.text}
            fontSize={obj.style?.fontSize ?? 12}
            fill={obj.style?.fill ?? "#e5e7eb"}
            listening={false}
          />
        ) : null}
      </Group>
    );
  }

  if (obj.shape === "text" && obj.position && obj.text) {
    return (
      <Text
        x={obj.position.x}
        y={obj.position.y}
        text={obj.text}
        fontSize={obj.style?.fontSize ?? 14}
        fill={obj.style?.fill ?? "#fbbf24"}
        opacity={obj.style?.opacity ?? 1}
        {...select}
      />
    );
  }

  if (obj.shape === "path" && obj.points && obj.points.length > 1) {
    const { stroke, strokeWidth } = selectedStroke(
      isSelected,
      "#fbbf24",
      obj.style?.stroke,
      2,
      obj.style?.strokeWidth,
    );

    return (
      <Line
        points={flatten(obj.points)}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={obj.style?.opacity ?? 1}
        lineCap="round"
        lineJoin="round"
        {...SHAPE_PERF}
        {...select}
      />
    );
  }

  if (obj.shape === "polygon" && obj.points && obj.points.length > 2) {
    const { stroke, strokeWidth } = selectedStroke(
      isSelected,
      "#fbbf24",
      obj.style?.stroke,
      1,
      obj.style?.strokeWidth,
    );

    return (
      <Line
        points={flatten(obj.points)}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={obj.style?.fill}
        opacity={obj.style?.opacity ?? 0.4}
        closed
        {...SHAPE_PERF}
        {...select}
      />
    );
  }

  return null;
}
