"use client";

import { useIntlayer } from "next-intlayer";

import { getPublicKeyBase64 } from "@/lib/node";
import { Button } from "@wowlab/shared/components/ui/button";
type SimulatorHeaderProps = {
  canRun: boolean;
  isClearing: boolean;
  isSubmitting: boolean;
  onBenchmark: () => void;
  onClearAll: () => void;
  onResetOverrides: () => void;
  onRun: () => void;
  overrideCount: number;
};

export function SimulatorHeader({
  canRun,
  isClearing,
  isSubmitting,
  onBenchmark,
  onClearAll,
  onResetOverrides,
  onRun,
  overrideCount,
}: Readonly<SimulatorHeaderProps>) {
  const content = useIntlayer("simulatorPage");

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-medium">{content.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          loading={isClearing}
          onClick={onClearAll}
        >
          {isClearing ? content.clearing : content.clearAllJobs}
        </Button>
        {overrideCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onResetOverrides}>
            {content.resetOverrides(overrideCount)}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onBenchmark}
          loading={isSubmitting}
          disabled={!canRun || !getPublicKeyBase64()}
        >
          {isSubmitting ? content.submitting : content.benchmark}
        </Button>
        <Button onClick={onRun} loading={isSubmitting} disabled={!canRun}>
          {isSubmitting ? content.submitting : content.runSimulation}
        </Button>
      </div>
    </div>
  );
}
