"use client";

import { Fragment } from "react";
import { Text } from "react-konva";

import type {
  ObjectId,
  SceneObject,
  Vec2,
} from "@/components/shared/canvas/scene/types";

import type { Handlers } from "./shape-helpers";

import { AnnotationShape } from "./shapes/annotation-shape";
import { EdgeShape } from "./shapes/edge-shape";
import { ImageShape } from "./shapes/image-shape";
import { LabelShape } from "./shapes/label-shape";
import { NodeShape } from "./shapes/node-shape";
import { PathShape } from "./shapes/path-shape";
import { PolygonShape } from "./shapes/polygon-shape";

type RenderObjectProps = {
  obj: SceneObject;
  positions: Map<ObjectId, Vec2>;
  handlers: Handlers;
  selectedId: ObjectId | null;
};

export function RenderObject({
  handlers,
  obj,
  positions,
  selectedId,
}: Readonly<RenderObjectProps>) {
  switch (obj.kind) {
    case "annotation": {
      return (
        <AnnotationShape
          obj={obj}
          handlers={handlers}
          selectedId={selectedId}
        />
      );
    }

    case "edge": {
      return <EdgeShape obj={obj} positions={positions} />;
    }

    case "image": {
      return <ImageShape obj={obj} />;
    }

    case "label": {
      return <LabelShape obj={obj} />;
    }

    case "node": {
      return (
        <Fragment>
          <NodeShape obj={obj} handlers={handlers} selectedId={selectedId} />
          {obj.label ? (
            <Text
              x={obj.position.x + (obj.style?.size ?? 12) + 4}
              y={obj.position.y - (obj.style?.size ?? 12)}
              text={obj.label}
              fontSize={11}
              fill="#cbd5f5"
              listening={false}
            />
          ) : null}
        </Fragment>
      );
    }

    case "path": {
      return (
        <PathShape obj={obj} handlers={handlers} selectedId={selectedId} />
      );
    }

    case "polygon": {
      return (
        <PolygonShape obj={obj} handlers={handlers} selectedId={selectedId} />
      );
    }
  }
}
