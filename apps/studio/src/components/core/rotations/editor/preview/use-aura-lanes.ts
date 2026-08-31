"use client";

import type { AuraInfo, SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import { useMemo } from "react";

import { formatSlug } from "@/components/core/rotations/format-slug";

import type { AuraCategory } from "./aura-classify";

import {
  AURA_CATEGORY_ORDER,
  auraLaneColor,
  classifyAura,
} from "./aura-classify";

export type AuraGroup = {
  avgUptimePct: number;
  category: AuraCategory;
  lanes: AuraLane[];
};

export type AuraLane = {
  applications: number;
  auraId: null | number;
  category: AuraCategory;
  color: string;
  displayName: string;
  firstMs: number;
  slug: string;
  source: string;
  uptimePct: number;
  windows: AuraWindow[];
};

export type AuraSort = "first" | "name" | "uptime";

export type AuraWindow = { endMs: number; startMs: number };

type UseAuraLanesArgs = {
  intro: null | SpecIntrospection;
  search: string;
  sort: AuraSort;
  trace: IterationTrace | null;
};

type UseAuraLanesResult = {
  groups: AuraGroup[];
  matchedLanes: number;
  totalLanes: number;
};

export function useAuraLanes({
  intro,
  search,
  sort,
  trace,
}: UseAuraLanesArgs): UseAuraLanesResult {
  const auraIndex = useMemo(() => buildAuraInfoIndex(intro), [intro]);

  const lanes = useMemo<AuraLane[]>(() => {
    const durationMs = trace?.durationMs ?? 0;
    const byslug = new Map<string, AuraWindow[]>();
    const sourceOf = new Map<string, string>();

    for (const event of trace?.auraEvents ?? []) {
      const endMs = event.endMs ?? durationMs;
      const windows = byslug.get(event.auraSlug);

      if (windows) {
        windows.push({ endMs, startMs: event.startMs });
      } else {
        byslug.set(event.auraSlug, [{ endMs, startMs: event.startMs }]);
        sourceOf.set(event.auraSlug, event.source);
      }
    }

    const out: AuraLane[] = [];

    for (const [slug, windows] of byslug) {
      const info = auraIndex.get(slug) ?? null;
      const uptimeMs = unionMs(windows, durationMs);
      const coverage = durationMs > 0 ? uptimeMs / durationMs : 0;
      const auraId = Number(slug);

      out.push({
        applications: windows.length,
        auraId: Number.isFinite(auraId) && auraId > 0 ? auraId : null,
        category: classifyAura(info, coverage),
        color: "",
        displayName: info?.name ?? formatSlug(slug),
        firstMs: Math.min(...windows.map((w) => w.startMs)),
        slug,
        source: sourceOf.get(slug) ?? "",
        uptimePct: Math.min(100, coverage * 100),
        windows,
      });
    }

    return out;
  }, [auraIndex, trace?.auraEvents, trace?.durationMs]);

  return useMemo(() => {
    const query = search.trim().toLowerCase();
    const byCategory = new Map<AuraCategory, AuraLane[]>();

    for (const lane of lanes) {
      const bucket = byCategory.get(lane.category);

      if (bucket) {
        bucket.push(lane);
      } else {
        byCategory.set(lane.category, [lane]);
      }
    }

    const groups: AuraGroup[] = [];
    let matchedLanes = 0;

    for (const category of AURA_CATEGORY_ORDER) {
      const bucket = byCategory.get(category);

      if (!bucket) {
        continue;
      }

      const sorted = [...bucket].sort((a, b) => compareLanes(a, b, sort));
      const colored = sorted.map((lane, index) => ({
        ...lane,
        color: auraLaneColor(category, index),
      }));
      const visible = query
        ? colored.filter((lane) =>
            lane.displayName.toLowerCase().includes(query),
          )
        : colored;

      matchedLanes += visible.length;

      if (visible.length === 0) {
        continue;
      }

      const avgUptimePct =
        visible.reduce((sum, lane) => sum + lane.uptimePct, 0) / visible.length;

      groups.push({ avgUptimePct, category, lanes: visible });
    }

    return { groups, matchedLanes, totalLanes: lanes.length };
  }, [lanes, search, sort]);
}

function buildAuraInfoIndex(
  intro: null | SpecIntrospection,
): Map<string, AuraInfo> {
  const map = new Map<string, AuraInfo>();

  for (const aura of intro?.auras ?? []) {
    map.set(String(aura.aura_id), aura);
    map.set(aura.slug, aura);
  }

  return map;
}

function compareLanes(a: AuraLane, b: AuraLane, sort: AuraSort): number {
  if (sort === "uptime") {
    return b.uptimePct - a.uptimePct;
  }

  if (sort === "name") {
    return a.displayName.localeCompare(b.displayName);
  }

  return a.firstMs - b.firstMs;
}

/** Total covered time of a set of (possibly overlapping) windows. */
function unionMs(windows: AuraWindow[], durationMs: number): number {
  const sorted = [...windows].sort((a, b) => a.startMs - b.startMs);
  let total = 0;
  let curStart = null as null | number;
  let curEnd = null as null | number;

  for (const window of sorted) {
    const start = Math.max(0, window.startMs);
    const end = Math.min(durationMs, window.endMs);

    if (end <= start) {
      continue;
    }

    if (curEnd === null || curStart === null) {
      curStart = start;
      curEnd = end;
    } else if (start <= curEnd) {
      curEnd = Math.max(curEnd, end);
    } else {
      total += curEnd - curStart;
      curStart = start;
      curEnd = end;
    }
  }

  if (curStart !== null && curEnd !== null) {
    total += curEnd - curStart;
  }

  return total;
}
