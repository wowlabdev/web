import type { CanvasLayer } from "@/components/shared/canvas";

export const CONTENT_LAYER_ID = "talents:content";

export const LABEL_LAYER_ID = "talents:labels";

export const ANNOTATION_LAYER_ID = "talents:annotations";

export const NODE_SIZE = 14;

export const LAYERS: ReadonlyArray<CanvasLayer> = [
  {
    id: CONTENT_LAYER_ID,
    isVisible: true,
    kind: "content",
    name: "Talents",
    z: 0,
  },
  {
    id: LABEL_LAYER_ID,
    isVisible: true,
    kind: "content",
    name: "Labels",
    z: 1,
  },
  {
    id: ANNOTATION_LAYER_ID,
    isVisible: true,
    kind: "annotation",
    name: "Annotations",
    z: 2,
  },
];
