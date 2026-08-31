export type ChartOverlayKey =
  "mean" | "movingAverage" | "percentileBands" | "stdBand" | "trendline";

export const ALL_OVERLAY_KEYS: ChartOverlayKey[] = [
  "mean",
  "stdBand",
  "percentileBands",
  "movingAverage",
  "trendline",
];

export const MOVING_AVERAGE_KEY = "__overlayMovingAvg";

export type CartesianXAxisProps<TData> = {
  dataKey: keyof TData & string;
  labelFormatter?: (label: unknown) => React.ReactNode;
  tickFormatter?: (value: unknown) => string;
};

export type CartesianYAxisProps = {
  allowDecimals?: boolean;
  tickFormatter?: (value: number) => string;
  width?: number;
};

export type ChartAnalyticsConfig<
  Key extends string = ChartOverlayKey,
  BaseSeriesKey extends string = string,
> = {
  /** Which series to base overlay stats on. Defaults to first series' dataKey. */
  baseSeries?: BaseSeriesKey;

  /** Default-on overlay keys. If omitted, every key in the chart's key set is on. */
  defaultKeys?: Key[];

  /** Show overlays. Default: true for time/index series, varies by chart type. */
  enabled?: boolean;
};

export type ChartSeries<TData> = {
  dataKey: keyof TData & string;
  label: string;

  /** CSS color. Defaults to var(--chart-{i+1}) by series order. */
  color?: string;
};
