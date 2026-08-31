"use client";

import { Text } from "react-konva";

import type { LabelObject } from "@/components/shared/canvas/scene/types";

type LabelShapeProps = {
  obj: LabelObject;
};

export function LabelShape({ obj }: Readonly<LabelShapeProps>) {
  return (
    <Text
      x={obj.position.x}
      y={obj.position.y}
      text={obj.text}
      fontSize={obj.style?.fontSize ?? 12}
      fontFamily={
        obj.style?.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"
      }
      fill={obj.style?.fill ?? "#e5e7eb"}
      listening={false}
    />
  );
}
