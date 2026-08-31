import type { TimeSeriesPoint } from "./types";

export type TimestampFormatter = (ts: number) => string;

export function mergeChartData(
  series: { key: string; points: TimeSeriesPoint[] }[],
  fmt: TimestampFormatter,
): { time: string; [k: string]: string | number }[] {
  if (series.length === 0) {
    return [];
  }

  if (series.length === 1) {
    return toChartData(series[0].points, fmt, series[0].key);
  }

  const primary = series[0].points;

  return primary.map((p, i) => {
    const row: { time: string; [k: string]: string | number } = {
      time: fmt(p.x),
    };

    for (const s of series) {
      row[s.key] = s.points[i]?.y ?? 0;
    }

    return row;
  });
}

export function toChartData(
  points: TimeSeriesPoint[],
  fmt: TimestampFormatter,
  key: string,
): { time: string; [k: string]: string | number }[] {
  return points.map((p) => ({
    [key]: p.y,
    time: fmt(p.x),
  }));
}
