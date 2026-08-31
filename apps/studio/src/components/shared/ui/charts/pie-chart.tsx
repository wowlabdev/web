"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";
import { Label, Pie, PieChart as RechartsPieChart } from "recharts";

import type { ChartConfig } from "@/components/shared/ui/chart";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/ui/chart";
import { cn } from "@wowlab/shared/lib/utils";

import {
  ChartEmpty,
  pickFallbackColor,
  readNumber,
  readString,
  rechartsDataKey,
  resolveHeight,
} from "./internal";

type PieChartProps<TData extends object> = {
  analytics?: { showTotal?: boolean; topN?: number };
  className?: string;

  /** Per-slice color key. Otherwise slices are auto-colored from var(--chart-1..5). */
  colorKey?: keyof TData & string;
  data: TData[];
  height?: number | string;
  nameKey: keyof TData & string;
  valueKey: keyof TData & string;
};

type PieDatum = { fill: string } & PieSlice;

type PieSlice = {
  color: null | string;
  name: string;
  value: number;
};

export function PieChart<TData extends object>({
  analytics,
  className,
  colorKey,
  data,
  height = 192,
  nameKey,
  valueKey,
}: Readonly<PieChartProps<TData>>) {
  const content = useIntlayer("chartOverlay");
  const fmtNumber = useNumber();
  const resolved = resolveHeight(height);
  const showTotal = analytics?.showTotal ?? true;
  const topN = analytics?.topN;
  const otherLabel = content.other.value;

  const slices = useMemo<PieSlice[]>(() => {
    const raw: PieSlice[] = [];

    for (const entry of data) {
      const name = readString(entry, nameKey);
      const value = readNumber(entry, valueKey);
      const color = colorKey ? readString(entry, colorKey) : null;

      if (name === null || value === null) {
        continue;
      }

      raw.push({ color, name, value });
    }

    if (!topN || topN >= raw.length) {
      return raw;
    }

    const sorted = [...raw].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const rest = sorted.slice(topN);

    if (rest.length === 0) {
      return top;
    }

    const otherValue = rest.reduce((acc, s) => acc + s.value, 0);

    return [
      ...top,
      { color: "var(--muted-foreground)", name: otherLabel, value: otherValue },
    ];
  }, [data, topN, nameKey, valueKey, colorKey, otherLabel]);

  const chartConfig: ChartConfig = useMemo(
    () =>
      slices.reduce<ChartConfig>((acc, slice, index) => {
        acc[slice.name] = {
          color: slice.color ?? pickFallbackColor(index),
          label: slice.name,
        };

        return acc;
      }, {}),
    [slices],
  );

  const pieData = useMemo<PieDatum[]>(
    () =>
      slices.map((slice, index) => ({
        ...slice,
        fill: slice.color ?? pickFallbackColor(index),
      })),
    [slices],
  );

  const total = useMemo(
    () => slices.reduce((acc, s) => acc + s.value, 0),
    [slices],
  );

  if (slices.length === 0) {
    return <ChartEmpty className={className} height={resolved} />;
  }

  return (
    <div
      className={cn("relative w-full", resolved.className)}
      style={resolved.style}
    >
      <ChartContainer
        className={cn("h-full w-full", className)}
        config={chartConfig}
      >
        <RechartsPieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="name" />}
            cursor={false}
          />
          <Pie
            data={pieData}
            dataKey={rechartsDataKey<PieDatum>("value")}
            innerRadius={48}
            nameKey={rechartsDataKey<PieDatum>("name")}
            outerRadius={88}
            paddingAngle={2}
            strokeWidth={2}
          >
            {showTotal && (
              <Label
                content={({ viewBox }) => {
                  if (
                    !viewBox ||
                    !("cx" in viewBox) ||
                    typeof viewBox.cx !== "number" ||
                    typeof viewBox.cy !== "number"
                  ) {
                    return null;
                  }

                  return (
                    <g>
                      <text
                        className="fill-foreground text-xl font-semibold"
                        dominantBaseline="central"
                        textAnchor="middle"
                        x={viewBox.cx}
                        y={viewBox.cy - 8}
                      >
                        {fmtNumber(total)}
                      </text>
                      <text
                        className="fill-muted-foreground text-xs"
                        dominantBaseline="central"
                        textAnchor="middle"
                        x={viewBox.cx}
                        y={viewBox.cy + 12}
                      >
                        {content.total.value}
                      </text>
                    </g>
                  );
                }}
                position="center"
              />
            )}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
}
