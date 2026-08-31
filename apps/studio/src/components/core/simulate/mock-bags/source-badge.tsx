"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";

export type BestSet = Record<string, number>;

export type SimPhase = "complete" | "idle" | "running";

type SourceBadgeProps = {
  source: "bag" | "equipped" | "weekly";
};

export function SourceBadge({ source }: Readonly<SourceBadgeProps>) {
  const content = useIntlayer("simulateMockBags");

  if (source === "weekly") {
    return (
      <Badge variant="secondary" className="h-3.5 px-1 text-[8px]">
        {content.weeklyBadge}
      </Badge>
    );
  }

  if (source === "equipped") {
    return (
      <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
        {content.equippedBadge}
      </Badge>
    );
  }

  return null;
}
