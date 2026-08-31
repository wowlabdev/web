"use client";

import { useMemoizedFn } from "ahooks";
import ms from "ms";
import { useDate } from "next-intlayer/format";

import type { TimeRange, TimestampFormatter } from "@/lib/metrics";

import { ONE_DAY_MS, SEVEN_DAYS_MS } from "@/lib/metrics";

export function useTimestampFormatter(range: TimeRange): TimestampFormatter {
  const fmtDate = useDate();

  return useMemoizedFn((ts: number) => {
    const d = new Date(ts * 1000);
    const rangeMs = ms(range);

    if (rangeMs >= SEVEN_DAYS_MS) {
      return fmtDate(d, { day: "numeric", month: "short" });
    }

    if (rangeMs >= ONE_DAY_MS) {
      return fmtDate(d, {
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
      });
    }

    return fmtDate(d, { hour: "2-digit", minute: "2-digit" });
  });
}
