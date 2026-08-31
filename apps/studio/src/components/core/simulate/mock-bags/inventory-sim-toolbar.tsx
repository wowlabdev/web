"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { TOTAL_CHUNKS } from "@/lib/sim/mock-bags-config";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Progress } from "@wowlab/shared/components/ui/progress";

import type { SimPhase } from "./source-badge";

type InventorySimToolbarProps = {
  chunk: number;
  onReset: () => void;
  phase: SimPhase;
};

export function InventorySimToolbar({
  chunk,
  onReset,
  phase,
}: Readonly<InventorySimToolbarProps>) {
  const content = useIntlayer("simulateMockBags");

  return (
    <div className="flex items-center gap-3">
      {phase === "running" && (
        <>
          <Button variant="destructive" size="sm" onClick={onReset}>
            {content.cancel}
          </Button>
          <Progress value={(chunk / TOTAL_CHUNKS) * 100} className="flex-1" />
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {Math.round((chunk / TOTAL_CHUNKS) * 100)}%
          </span>
        </>
      )}
      {phase === "complete" && (
        <>
          <Badge variant="default" className="gap-1 px-2 py-0.5 text-[10px]">
            <CheckCircle2Icon className="size-3" />
            {content.done}
          </Badge>
          <Button variant="outline" size="sm" onClick={onReset}>
            {content.toolbarReset}
          </Button>
        </>
      )}
    </div>
  );
}
