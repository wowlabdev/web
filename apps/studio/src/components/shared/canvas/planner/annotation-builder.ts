import type { AnnotationObject, AnnotationStyle, Vec2 } from "../scene/types";

export type AnnotationDraft = {
  tool: Exclude<AnnotationTool, "select">;
  points: ReadonlyArray<Vec2>;
  text?: string;
};

export type AnnotationTool = "select" | "marker" | "text" | "path" | "polygon";

export type CreateAnnotationInput = {
  draft: AnnotationDraft;
  layerId: string;
  color: string;
};

export function createAnnotation(
  input: CreateAnnotationInput,
): AnnotationObject | null {
  const { color, draft, layerId } = input;
  const id = crypto.randomUUID();
  const baseStyle: AnnotationStyle = {
    fill: color,
    opacity: 1,
    stroke: color,
    strokeWidth: 2,
  };

  if (draft.tool === "marker") {
    if (draft.points.length === 0) {
      return null;
    }

    return {
      id,
      kind: "annotation",
      layerId,
      position: draft.points[0],
      shape: "marker",
      style: baseStyle,
      text: draft.text,
    };
  }

  if (draft.tool === "text") {
    if (draft.points.length === 0 || !draft.text) {
      return null;
    }

    return {
      id,
      kind: "annotation",
      layerId,
      position: draft.points[0],
      shape: "text",
      style: { ...baseStyle, fontSize: 16 },
      text: draft.text,
    };
  }

  if (draft.tool === "path") {
    if (draft.points.length < 2) {
      return null;
    }

    return {
      id,
      kind: "annotation",
      layerId,
      points: draft.points,
      shape: "path",
      style: baseStyle,
    };
  }

  if (draft.points.length < 3) {
    return null;
  }

  return {
    id,
    kind: "annotation",
    layerId,
    points: draft.points,
    shape: "polygon",
    style: { ...baseStyle, opacity: 0.35 },
  };
}
