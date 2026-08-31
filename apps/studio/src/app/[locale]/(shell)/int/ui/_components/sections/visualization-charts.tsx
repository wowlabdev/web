"use client";

import {
  AreaChart,
  BarChart,
  type ChartSeries,
  ComposedChart,
  type ComposedSeries,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
} from "@/components/shared/ui/charts";

import { DemoSubsection } from "../demo";

type TimeSeriesRow = { dps: number; hps: number; time: string };

const timeSeriesData: TimeSeriesRow[] = [
  { dps: 48_200, hps: 12_400, time: "0s" },
  { dps: 51_300, hps: 14_200, time: "30s" },
  { dps: 49_800, hps: 11_800, time: "60s" },
  { dps: 52_100, hps: 15_600, time: "90s" },
  { dps: 50_400, hps: 13_100, time: "120s" },
  { dps: 51_700, hps: 14_800, time: "150s" },
];

const damageBreakdown = [
  { spell: "Pyroblast", value: 32 },
  { spell: "Fireball", value: 28 },
  { spell: "Scorch", value: 18 },
  { spell: "Phoenix Flames", value: 14 },
  { spell: "Other", value: 8 },
];

const secondaryStats = [
  { stat: "Crit", value: 32 },
  { stat: "Haste", value: 28 },
  { stat: "Mastery", value: 18 },
  { stat: "Versatility", value: 14 },
  { stat: "Leech", value: 10 },
];

const gearProgress = [
  { name: "Tier set", value: 75 },
  { name: "Trinkets", value: 90 },
  { name: "Talents", value: 100 },
  { name: "Embellishments", value: 55 },
];

const iterationScatter = Array.from({ length: 40 }, (_, i) => ({
  dps: 48_000 + Math.round(Math.sin(i * 0.7) * 2500 + (i % 5) * 400),
  iter: i + 1,
  weight: 100 + (i % 6) * 60,
}));

const cartesianSeries: ChartSeries<TimeSeriesRow>[] = [
  { dataKey: "dps", label: "DPS" },
  { dataKey: "hps", label: "HPS" },
];

const composedSeries: ComposedSeries<TimeSeriesRow>[] = [
  { dataKey: "dps", kind: "bar", label: "DPS" },
  { dataKey: "hps", kind: "line", label: "HPS" },
];

export function ChartsDemo() {
  return (
    <>
      <DemoSubsection title="Area Chart">
        <div className="rounded-sm border p-4">
          <AreaChart
            data={timeSeriesData}
            series={cartesianSeries}
            xAxis={{ dataKey: "time" }}
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Bar Chart">
        <div className="rounded-sm border p-4">
          <BarChart
            data={timeSeriesData}
            series={cartesianSeries}
            xAxis={{ dataKey: "time" }}
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Line Chart">
        <div className="rounded-sm border p-4">
          <LineChart
            data={timeSeriesData}
            series={cartesianSeries}
            xAxis={{ dataKey: "time" }}
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Composed Chart">
        <div className="rounded-sm border p-4">
          <ComposedChart
            data={timeSeriesData}
            series={composedSeries}
            xAxis={{ dataKey: "time" }}
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Scatter Chart">
        <div className="rounded-sm border p-4">
          <ScatterChart
            analytics={{ defaultKeys: ["regression"] }}
            data={iterationScatter}
            name="DPS"
            xKey="iter"
            yKey="dps"
            zKey="weight"
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Pie Chart">
        <div className="rounded-sm border p-4">
          <PieChart
            data={damageBreakdown}
            height={256}
            nameKey="spell"
            valueKey="value"
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Radar Chart">
        <div className="rounded-sm border p-4">
          <RadarChart
            categoryKey="stat"
            data={secondaryStats}
            height={256}
            series={[{ dataKey: "value", label: "Rating %" }]}
          />
        </div>
      </DemoSubsection>
      <DemoSubsection title="Radial Bar Chart">
        <div className="rounded-sm border p-4">
          <RadialBarChart
            analytics={{ targetValue: 100 }}
            data={gearProgress}
            height={256}
            nameKey="name"
            valueKey="value"
          />
        </div>
      </DemoSubsection>
    </>
  );
}
