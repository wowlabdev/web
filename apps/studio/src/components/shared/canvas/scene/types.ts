export type AnnotationKind = "marker" | "text" | "path" | "polygon";

export type AnnotationObject = {
  kind: "annotation";
  shape: AnnotationKind;
  position?: Vec2;
  points?: ReadonlyArray<Vec2>;
  text?: string;
  attachedTo?: ObjectId;
  isSelectable?: boolean;
  style?: AnnotationStyle;
} & ObjectBase;

export type AnnotationStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  glyph?: string;
};

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CanvasLayer = {
  id: string;
  kind: LayerKind;
  z: number;
  isVisible: boolean;
  name?: string;
};

export type CanvasScene = {
  id: string;
  bounds: Bounds;

  // Pan-clamp region; falls back to `bounds` when absent.
  panBounds?: Bounds;
  layers: ReadonlyArray<CanvasLayer>;
  objects: ReadonlyArray<SceneObject>;
  initialViewport?: Viewport;
  metadata?: Metadata;
};

export type EdgeObject = {
  kind: "edge";
  fromId: ObjectId;
  toId: ObjectId;
  style?: EdgeStyle;
} & ObjectBase;

export type EdgeStyle = {
  stroke?: string;
  strokeWidth?: number;
  dash?: "solid" | "dashed" | "dotted";
  opacity?: number;
  isArrow?: boolean;
};

export type ImageObject = {
  kind: "image";
  position: Vec2;
  size: { width: number; height: number };
  imageUrl: string;
  opacity?: number;
  crossOrigin?: "anonymous" | "use-credentials";
} & ObjectBase;

export type LabelObject = {
  kind: "label";
  position: Vec2;
  text: string;
  style?: LabelStyle;
} & ObjectBase;

export type LabelStyle = {
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  background?: string;
  padding?: number;
};

export type LayerKind = "background" | "content" | "annotation" | "overlay";

export type Metadata = Record<string, unknown>;

export type NodeObject = {
  kind: "node";
  position: Vec2;
  label?: string;
  isSelectable?: boolean;
  style?: NodeStyle;
} & ObjectBase;

export type NodeShape = "circle" | "square" | "diamond" | "hex";

export type NodeStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  size?: number;
  shape?: NodeShape;
  iconUrl?: string;
  badge?: string;
  opacity?: number;
};

// eslint-disable-next-line sonarjs/redundant-type-aliases -- exported domain alias consumed by out-of-scope modules; inlining would break their imports
export type ObjectId = string;

export type PathObject = {
  kind: "path";
  points: ReadonlyArray<Vec2>;
  isSelectable?: boolean;
  style?: PathStyle;
} & ObjectBase;

export type PathStyle = {
  stroke?: string;
  strokeWidth?: number;
  dash?: "solid" | "dashed" | "dotted";
  opacity?: number;
  isClosed?: boolean;
  fill?: string;
};

export type PolygonObject = {
  kind: "polygon";
  points: ReadonlyArray<Vec2>;
  isSelectable?: boolean;
  style?: PolygonStyle;
} & ObjectBase;

export type PolygonStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

export type SceneObject =
  | NodeObject
  | EdgeObject
  | PathObject
  | PolygonObject
  | LabelObject
  | AnnotationObject
  | ImageObject;

export type Vec2 = { x: number; y: number };

export type Viewport = {
  pan: Vec2;
  zoom: number;
};

type ObjectBase = {
  id: ObjectId;
  layerId: string;
  metadata?: Metadata;
};
