import type { PreviewControls } from "./use-live-trace";
import type { PreviewQuery } from "./use-preview-query";

export function firingCountKey(listId: string, actionIndex: number): string {
  return `${listId}#${actionIndex}`;
}

export function toPreviewControls(query: PreviewQuery): PreviewControls {
  return {
    archetype: query.archetype,
    durationS: query.duration,
    seed: query.seed,
    targetCount: query.targets,
  };
}
