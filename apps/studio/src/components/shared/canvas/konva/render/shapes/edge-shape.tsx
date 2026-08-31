"use client";

import { Arrow, Line } from "react-konva";

import type {
  EdgeObject,
  ObjectId,
  Vec2,
} from "@/components/shared/canvas/scene/types";

import { dashFor, SHAPE_PERF } from "../shape-helpers";

type EdgeShapeProps = {
  obj: EdgeObject;
  positions: Map<ObjectId, Vec2>;
};

export function EdgeShape({ obj, positions }: Readonly<EdgeShapeProps>) {
  const a = positions.get(obj.fromId);
  const b = positions.get(obj.toId);

  if (!a || !b) {
    return null;
  }

  const stroke = obj.style?.stroke ?? "#475569";
  const strokeWidth = obj.style?.strokeWidth ?? 1;
  const opacity = obj.style?.opacity ?? 1;
  const dash = dashFor(obj.style);
  const points = [a.x, a.y, b.x, b.y];

  if (obj.style?.isArrow) {
    return (
      <Arrow
        points={points}
        stroke={stroke}
        fill={stroke}
        strokeWidth={strokeWidth}
        dash={dash}
        opacity={opacity}
        listening={false}
        {...SHAPE_PERF}
      />
    );
  }

  return (
    <Line
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dash={dash}
      opacity={opacity}
      listening={false}
      {...SHAPE_PERF}
    />
  );
}
