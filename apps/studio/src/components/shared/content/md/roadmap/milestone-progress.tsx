"use client";

import { useIntlayer } from "next-intlayer";

import { Progress } from "@wowlab/shared/components/ui/progress";

type MilestoneProgressProps = {
  closed: number;
  open: number;
};

export function MilestoneProgress({
  closed,
  open,
}: Readonly<MilestoneProgressProps>) {
  const { roadmap: content } = useIntlayer("article");
  const total = open + closed;
  const pct = total > 0 ? Math.round((closed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.completed({ closed, total })}
        </span>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
