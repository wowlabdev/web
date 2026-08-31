"use client";

import { useMemoizedFn } from "ahooks";
import { useNumber } from "next-intlayer/format";

import { FormattedDuration } from "@wowlab/shared/components/common";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60_000;

export function useChartTimeFormatters(precision = 0) {
  const fmtNumber = useNumber();
  const tickFormatter = useMemoizedFn((v: unknown) =>
    typeof v === "number"
      ? fmtNumber(v / 1000, {
          maximumFractionDigits: precision,
          style: "unit",
          unit: "second",
        })
      : "",
  );

  const labelFormatter = useMemoizedFn((label: unknown) =>
    typeof label === "number" ? (
      <FormattedDuration seconds={label / 1000} />
    ) : null,
  );

  return { labelFormatter, tickFormatter };
}

/** Compact axis-tick formatter for timeline axes covering anywhere from ms to minutes. */
export function useTimelineTickFormatter() {
  const fmtNumber = useNumber();

  return useMemoizedFn((ms: number) => {
    if (ms < MS_PER_SECOND) {
      return fmtNumber(ms, {
        maximumFractionDigits: 0,
        style: "unit",
        unit: "millisecond",
      });
    }

    if (ms < MS_PER_MINUTE) {
      return fmtNumber(ms / MS_PER_SECOND, {
        maximumFractionDigits: 1,
        style: "unit",
        unit: "second",
      });
    }

    return fmtNumber(ms / MS_PER_MINUTE, {
      maximumFractionDigits: 1,
      style: "unit",
      unit: "minute",
    });
  });
}
