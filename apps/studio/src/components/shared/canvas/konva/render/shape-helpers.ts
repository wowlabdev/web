import type { ObjectId, Vec2 } from "@/components/shared/canvas/scene/types";

export const SELECTED_STROKE = "#fbbf24";

export const SELECTED_STROKE_WIDTH = 2;

export const DASH_DASHED: number[] = [10, 6];

export const DASH_DOTTED: number[] = [2, 4];

export const SHAPE_PERF = {
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
} as const;

export type Handlers = {
  onSelect?: (id: ObjectId) => void;
};

export function dashFor(
  style: { dash?: "solid" | "dashed" | "dotted" } | undefined,
): number[] | undefined {
  if (!style || !style.dash || style.dash === "solid") {
    return undefined;
  }

  if (style.dash === "dashed") {
    return DASH_DASHED;
  }

  return DASH_DOTTED;
}

export function flatten(points: ReadonlyArray<Vec2>): number[] {
  const out: number[] = [];

  for (const p of points) {
    out.push(p.x, p.y);
  }

  return out;
}

export function selectedStroke(
  isSelected: boolean | undefined,
  fallbackStroke: string,
  providedStroke: string | undefined,
  fallbackWidth = 1,
  providedWidth: number | undefined = undefined,
): { stroke: string; strokeWidth: number } {
  if (isSelected) {
    return { stroke: SELECTED_STROKE, strokeWidth: SELECTED_STROKE_WIDTH };
  }

  return {
    stroke: providedStroke ?? fallbackStroke,
    strokeWidth: providedWidth ?? fallbackWidth,
  };
}

export function withSelectHandlers(
  obj: { id: ObjectId; isSelectable?: boolean },
  handlers: Handlers,
) {
  if (!obj.isSelectable || !handlers.onSelect) {
    return;
  }

  return {
    onClick: () => handlers.onSelect?.(obj.id),
    onTap: () => handlers.onSelect?.(obj.id),
  };
}
