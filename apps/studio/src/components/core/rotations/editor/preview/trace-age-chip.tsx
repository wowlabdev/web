"use client";

import { RelativeTime } from "@wowlab/shared/components/common";

type TraceAgeChipProps = {
  at: null | number;
};

export function TraceAgeChip({ at }: Readonly<TraceAgeChipProps>) {
  if (at == null) {
    return null;
  }

  return (
    <span className="text-[11px] text-muted-foreground tabular-nums">
      <RelativeTime at={at} isTicking fallback="" />
    </span>
  );
}
