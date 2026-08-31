"use client";

import { Layer } from "react-konva";

import type { CanvasLayer, ObjectId, SceneObject, Vec2 } from "../scene/types";

import { RenderObject } from "./render/render-object";

type KonvaLayerProps = {
  layer: CanvasLayer;
  objects: ReadonlyArray<SceneObject>;
  positions: Map<ObjectId, Vec2>;
  onSelect?: (id: ObjectId | null) => void;
  selectedId: ObjectId | null;
};

export function KonvaLayer({
  layer,
  objects,
  onSelect,
  positions,
  selectedId,
}: Readonly<KonvaLayerProps>) {
  const listening = layer.kind !== "background";
  const handlers = {
    onSelect: (id: ObjectId) => {
      onSelect?.(id);
    },
  };

  return (
    <Layer listening={listening}>
      {objects.map((object) => (
        <RenderObject
          handlers={handlers}
          key={object.id}
          obj={object}
          positions={positions}
          selectedId={selectedId}
        />
      ))}
    </Layer>
  );
}
