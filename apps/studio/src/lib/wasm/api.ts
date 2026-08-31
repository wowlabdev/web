import type {
  AnalyticsView,
  AnalyzeResult,
  ChartOverlayView,
  ImplementedSpecInfo,
  ItemDataFlat,
  ItemScalingData,
  JobResultView,
  Profile,
  ResolvedItem,
  ResolvedPaperdoll,
  ScatterOverlayView,
  SpellDescRenderResult,
  SpellRenderInput,
  TimelineGeometry,
  TimelineMetrics,
  TimelineViewport,
} from "wowlab-common";

import type { SimConfigInput } from "@/lib/sim/encounter";
import type { Row } from "@wowlab/shared/lib/supabase/types";

type CommonModule = typeof import("wowlab-common");
type EngineModule = typeof import("wowlab-engine");

export function analyzeSpellDesc(
  common: CommonModule,
  input: string,
  selfSpellId: number,
): AnalyzeResult {
  return common.analyzeSpellDesc(input, selfSpellId);
}

export function buildSentinelConfig(
  common: CommonModule,
  input: Record<string, unknown>,
): string {
  return common.buildSentinelConfig(input);
}

export function buildSimConfig(
  common: CommonModule,
  input: SimConfigInput,
): string {
  return common.buildSimConfig(input);
}

export function computeChartOverlay(
  common: CommonModule,
  yValues: number[],
): ChartOverlayView {
  return common.computeChartOverlay(Float64Array.from(yValues));
}

export function computeScatterOverlay(
  common: CommonModule,
  xs: number[],
  ys: number[],
): ScatterOverlayView {
  return common.computeScatterOverlay(
    Float64Array.from(xs),
    Float64Array.from(ys),
  );
}

export function computeTimelineMetrics(
  common: CommonModule,
  geometry: TimelineGeometry,
): TimelineMetrics {
  return common.computeTimelineMetrics(geometry);
}

export function decodeAndDerive(
  common: CommonModule,
  job: Pick<Row<"jobs">, "result_pb" | "timeline_pb">,
): AnalyticsView | null {
  if (!job.result_pb || !job.timeline_pb) {
    return null;
  }

  try {
    return common.decodeAndDerive(job.result_pb, job.timeline_pb);
  } catch {
    return null;
  }
}

export function decodeJobResult(
  common: CommonModule,
  job: Pick<Row<"jobs">, "result_pb" | "timeline_pb">,
): JobResultView | null {
  if (!job.result_pb || !job.timeline_pb) {
    return null;
  }

  try {
    return common.decodeJobResult(job.result_pb, job.timeline_pb);
  } catch {
    return null;
  }
}

export function decodeLoadout(common: CommonModule, loadout: string): unknown {
  return common.decodeLoadout(loadout);
}

export function extractSpecIdFromLoadout(
  common: CommonModule,
  loadout: string,
): number {
  return common.extractSpecIdFromLoadout(loadout);
}

export function panTimelineBy(
  common: CommonModule,
  geometry: TimelineGeometry,
  startPanMs: number,
  deltaPx: number,
): TimelineViewport {
  return common.panTimelineBy(geometry, startPanMs, deltaPx);
}

export function parseImplementedSpecs(
  common: CommonModule,
  input: unknown,
): ImplementedSpecInfo[] {
  return common.parseImplementedSpecs(input);
}

export function parseSimcProfile(common: CommonModule, input: string): Profile {
  return common.parseSimc(input);
}

export function renderGlobalString(
  common: CommonModule,
  value: string,
): string {
  return common.renderGlobalString(value);
}

export function renderSpellDescWithData(
  common: CommonModule,
  input: SpellRenderInput,
): SpellDescRenderResult {
  return common.renderSpellDescWithData(input);
}

export function resolveItem(
  common: CommonModule,
  baseItem: ItemDataFlat,
  bonusIds: number[],
  scalingData: ItemScalingData,
  playerLevel?: number,
  dropLevel?: number,
): ResolvedItem {
  return common.resolveItem(
    baseItem,
    bonusIds,
    scalingData,
    playerLevel,
    dropLevel,
  );
}

export async function resolvePaperdoll(
  engine: EngineModule,
  simConfig: string,
  level: number,
  isMale: boolean,
  resolver: Record<string, unknown>,
): Promise<ResolvedPaperdoll> {
  return (await engine.resolvePaperdoll(
    simConfig,
    level,
    isMale,
    resolver,
  )) as ResolvedPaperdoll;
}

export function zoomTimelineAt(
  common: CommonModule,
  geometry: TimelineGeometry,
  localX: number,
  zoomIn: boolean,
  zoomFactor: number,
): TimelineViewport {
  return common.zoomTimelineAt(geometry, localX, zoomIn, zoomFactor);
}
