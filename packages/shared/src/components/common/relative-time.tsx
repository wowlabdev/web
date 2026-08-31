"use client";

import { useInterval, useMount } from "ahooks";
import { useRelativeTime } from "next-intlayer/format";
import { type ReactNode, useState } from "react";

type RelativeTimeOptions = NonNullable<
  Parameters<ReturnType<typeof useRelativeTime>>[2]
>;

type RelativeTimeProps = {
  at: Date | null | number | string | undefined;
  fallback?: ReactNode;
  isTicking?: boolean;
  options?: RelativeTimeOptions;
};

const DEFAULT_OPTIONS: RelativeTimeOptions = { numeric: "auto" };

export function RelativeTime({
  at,
  fallback = "—",
  isTicking = false,
  options = DEFAULT_OPTIONS,
}: Readonly<RelativeTimeProps>) {
  const relativeTime = useRelativeTime();
  const [now, setNow] = useState<null | number>(null);

  useMount(() => setNow(Date.now()));
  useInterval(
    () => setNow(Date.now()),
    isTicking && now != null ? 1000 : undefined,
  );

  if (now == null || at == null) {
    return <>{fallback}</>;
  }

  const resolved = options.unit
    ? options
    : { ...options, unit: selectUnit((new Date(at).getTime() - now) / 1000) };

  return <>{relativeTime(now, at, resolved)}</>;
}

function selectUnit(seconds: number): Intl.RelativeTimeFormatUnit {
  const abs = Math.abs(seconds);

  if (abs < 60) {
    return "second";
  }

  if (abs < 3600) {
    return "minute";
  }

  if (abs < 86_400) {
    return "hour";
  }

  if (abs < 2_592_000) {
    return "day";
  }

  if (abs < 31_536_000) {
    return "month";
  }

  return "year";
}
