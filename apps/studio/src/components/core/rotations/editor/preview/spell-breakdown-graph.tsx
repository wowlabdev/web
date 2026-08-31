"use client";

import type { SpecIntrospection } from "wowlab-common";
import type { ActionStat, IterationTrace } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  BarChart,
  type ChartSeries,
  PieChart,
} from "@/components/shared/ui/charts";
import { useIsMobile } from "@wowlab/shared/hooks/use-is-mobile";

import { stringHashToHsl } from "./palette";

const TOP_N = 8;

type CastsPoint = {
  casts: number;
  name: string;
};

type DamageSlice = {
  color: string;
  name: string;
  value: number;
};

type SpellBreakdownGraphProps = {
  intro: null | SpecIntrospection;
  metric: "casts" | "damage";
  trace: IterationTrace | null;
};

export function SpellBreakdownGraph({
  intro,
  metric,
  trace,
}: Readonly<SpellBreakdownGraphProps>) {
  const content = useIntlayer("rotationEditor");
  const isMobile = useIsMobile();
  const nameById = useSpellNames(intro);

  const stats = useMemo<ActionStat[]>(
    () =>
      (trace?.actionStats ?? []).filter((a) =>
        metric === "damage" ? a.totalDamage > 0 : a.casts > 0,
      ),
    [trace?.actionStats, metric],
  );

  const damageData = useMemo<DamageSlice[]>(
    () =>
      stats.map((a) => {
        const name = nameById.get(a.spellId) ?? `#${a.spellId}`;

        return { color: stringHashToHsl(name), name, value: a.totalDamage };
      }),
    [stats, nameById],
  );

  const castsData = useMemo<CastsPoint[]>(
    () =>
      [...stats]
        .sort((a, b) => b.casts - a.casts)
        .slice(0, TOP_N)
        .map((a) => ({
          casts: a.casts,
          name: nameById.get(a.spellId) ?? `#${a.spellId}`,
        })),
    [stats, nameById],
  );

  const castsSeries = useMemo<ChartSeries<CastsPoint>[]>(
    () => [
      {
        color: "var(--chart-2)",
        dataKey: "casts",
        label: content.previewBreakdownCastsLabel.value,
      },
    ],
    [content.previewBreakdownCastsLabel],
  );

  if (!trace) {
    return null;
  }

  if (stats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {content.previewBreakdownEmpty}
      </p>
    );
  }

  const height = isMobile ? 200 : 240;

  if (metric === "damage") {
    return (
      <PieChart
        analytics={{ topN: TOP_N }}
        colorKey="color"
        data={damageData}
        height={height}
        nameKey="name"
        valueKey="value"
      />
    );
  }

  return (
    <BarChart
      analytics={{ enabled: false }}
      data={castsData}
      height={height}
      series={castsSeries}
      xAxis={{ dataKey: "name", tickFormatter: truncateName }}
    />
  );
}

function truncateName(value: unknown): string {
  const text = String(value);

  return text.length > 8 ? `${text.slice(0, 7)}…` : text;
}

function useSpellNames(intro: null | SpecIntrospection): Map<number, string> {
  return useMemo(() => {
    const map = new Map<number, string>();

    for (const spell of intro?.spells ?? []) {
      map.set(spell.spell_id, spell.name);
    }

    return map;
  }, [intro]);
}
