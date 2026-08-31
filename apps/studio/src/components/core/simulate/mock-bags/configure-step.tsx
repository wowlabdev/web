"use client";

import { PlayIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { PERMS_PER_CHUNK, TOTAL_CHUNKS } from "@/lib/sim/mock-bags-config";
import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";

import type { SimPhase } from "./source-badge";

type ConfigureStepProps = {
  onBack: () => void;
  onStart: () => void;
  phase: SimPhase;
  specName: string | null;
};

export function ConfigureStep({
  onBack,
  onStart,
  phase,
  specName,
}: Readonly<ConfigureStepProps>) {
  const content = useIntlayer("simulateMockBags");
  const shared = useIntlayer("simulateShared");

  return (
    <>
      <div className="space-y-2">
        <Label>{content.rotationLabel}</Label>
        <p className="text-xs text-muted-foreground">
          {specName
            ? content.rotationUsingDefault({ spec: specName })
            : content.rotationUsingDefaultFallback}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{content.simulationLabel}</Label>
        <p className="text-xs text-muted-foreground">
          {content.simulationSummary({
            chunks: TOTAL_CHUNKS,
            permutations: TOTAL_CHUNKS * PERMS_PER_CHUNK,
          })}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {shared.back}
        </Button>
        <Button onClick={onStart} loading={phase === "running"}>
          {phase !== "running" && (
            <PlayIcon className="size-3" data-icon="inline-start" />
          )}
          {content.startSimulation}
        </Button>
      </div>
    </>
  );
}
