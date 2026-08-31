"use client";

import { useIntlayer } from "next-intlayer";

import { useSimulatorStore } from "@/lib/state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

type SimulatorIterationsCardProps = {
  iterations: number;
};

export function SimulatorIterationsCard({
  iterations,
}: Readonly<SimulatorIterationsCardProps>) {
  const setIterations = useSimulatorStore((s) => s.setIterations);
  const content = useIntlayer("simulatorPage");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{content.iterationsTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Label htmlFor="iterations-input">{content.iterationsTitle}</Label>
          <Input
            id="iterations-input"
            type="number"
            min={1000}
            max={1_000_000}
            step={1000}
            value={iterations}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value, 10);

              if (!Number.isNaN(val)) {
                setIterations(val);
              }
            }}
            className="w-36"
          />
          <span className="text-xs text-muted-foreground">
            {content.iterationsRange}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
