"use client";

import { useIntlayer } from "next-intlayer";

import { useAutoSelectRotation } from "@/hooks/use-auto-select-rotation";
import { useRotations } from "@/lib/query/services/game";
import { useSimulatorStore } from "@/lib/state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type SimulatorRotationCardProps = {
  rotationId: string | null;
  specId: number;
  specName: string | null;
};

export function SimulatorRotationCard({
  rotationId,
  specId,
  specName,
}: Readonly<SimulatorRotationCardProps>) {
  const setRotationId = useSimulatorStore((s) => s.setRotationId);
  const content = useIntlayer("simulatorPage");
  const { data: rotations, isLoading: isLoadingRotations } =
    useRotations(specId);

  useAutoSelectRotation(specId, rotations);

  const renderRotationField = () => {
    if (isLoadingRotations) {
      return (
        <p className="text-xs text-muted-foreground">
          {content.loadingRotations}
        </p>
      );
    }

    if (rotations && rotations.length > 0) {
      return (
        <div className="flex items-center gap-3">
          <Label htmlFor="rotation-select">{content.rotationLabel}</Label>
          <Select
            value={rotationId ?? undefined}
            onValueChange={(val) => setRotationId(val)}
          >
            <SelectTrigger id="rotation-select" className="w-64">
              <SelectValue placeholder={content.rotationPlaceholder.value} />
            </SelectTrigger>
            <SelectContent>
              {rotations.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <p className="text-xs text-muted-foreground">
        {content.noRotationsAvailable({ spec: specName ?? "" })}
      </p>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{content.rotationTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{renderRotationField()}</CardContent>
    </Card>
  );
}
