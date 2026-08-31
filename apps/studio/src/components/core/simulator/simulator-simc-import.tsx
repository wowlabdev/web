"use client";

import { useIntlayer } from "next-intlayer";

import { useSimulatorStore } from "@/lib/state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

type SimulatorSimcImportProps = {
  parseError: string | null;
  simcInput: string;
};

export function SimulatorSimcImport({
  parseError,
  simcInput,
}: Readonly<SimulatorSimcImportProps>) {
  const setSimcInput = useSimulatorStore((s) => s.setSimcInput);
  const content = useIntlayer("simulatorPage");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{content.simcImportTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          className="h-40 resize-y font-mono"
          placeholder={content.simcInputPlaceholder.value}
          value={simcInput}
          onChange={(e) => setSimcInput(e.target.value)}
        />
        {parseError && <p className="text-xs text-destructive">{parseError}</p>}
      </CardContent>
    </Card>
  );
}
