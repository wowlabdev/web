import type { CanvasLayer } from "@/components/shared/canvas";

export const TILE_W = 384;

export const TILE_H = 256;

export const TILES_LAYER = "dungeon:tiles";

export const CONTENT_LAYER = "dungeon:content";

export const ANNOTATION_LAYER = "dungeon:annotations";

// Konva caps practical layer count at 3-5; interactive objects share one content layer, z-ordered by insertion.
export const LAYERS: ReadonlyArray<CanvasLayer> = [
  { id: TILES_LAYER, isVisible: true, kind: "background", name: "Map", z: 0 },
  {
    id: CONTENT_LAYER,
    isVisible: true,
    kind: "content",
    name: "Content",
    z: 1,
  },
  {
    id: ANNOTATION_LAYER,
    isVisible: true,
    kind: "annotation",
    name: "Notes",
    z: 2,
  },
];

export const DEFAULT_TILE_ZOOM = 2;

export const PACK_OPACITY_FOCUSED = 0.32;

export const PACK_OPACITY_DIMMED = 0.08;

export const PACK_STROKE_WIDTH_FOCUSED = 2;

export const PACK_STROKE_WIDTH_DIMMED = 1;

export const PACK_LABEL_OFFSET_X = -6;

export const PACK_LABEL_OFFSET_Y = -8;

export const PACK_LABEL_FONT_SIZE = 14;

export const PACK_LABEL_FILL = "#0f172a";

export const PATROL_OPACITY = 0.7;

export const PATROL_STROKE_WIDTH = 2;

export const ENEMY_NODE_RADIUS = 4.5;

export const ENEMY_OPACITY_FOCUSED = 1;

export const ENEMY_OPACITY_DIMMED = 0.25;

export const ENEMY_STROKE_WIDTH = 1;
