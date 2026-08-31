"use client";

import { useIntlayer } from "next-intlayer";

import { StatusDot } from "@wowlab/shared/components/common";

import { useFetching } from "./use-fetching";

export function PollingIndicator() {
  const content = useIntlayer("metricsPage");
  const { isAnyFetching } = useFetching();

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <StatusDot
        tone={isAnyFetching ? "pending" : "success"}
        isPulsing={isAnyFetching}
      />
      {isAnyFetching ? content.updating : content.live}
    </span>
  );
}
