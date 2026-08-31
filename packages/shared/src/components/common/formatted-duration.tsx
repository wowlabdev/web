"use client";

import { formatDuration, intervalToDuration } from "date-fns";
import { useIntlayer } from "next-intlayer";

type DurationOptions = NonNullable<Parameters<typeof formatDuration>[1]>;

export function FormattedDuration({
  fallback,
  seconds,
  ...options
}: {
  fallback?: string;
  seconds: number;
} & DurationOptions) {
  const content = useIntlayer("commonComponents");
  const ms = Math.max(0, Math.round(seconds) * 1000);
  const text = formatDuration(
    intervalToDuration({ end: ms, start: 0 }),
    options,
  );

  return <>{text || fallback || content.durationFallback.value}</>;
}
