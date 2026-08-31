"use client";

import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type RotationSelectFieldProps = {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
  noRotationsLabel: string;
  onRotationIdChange: (value: string) => void;
  placeholder: string;
  rotationId: string | null;
  rotations: { id: string; name: string }[] | undefined;
};

export function RotationSelectField({
  isLoading,
  label,
  loadingLabel,
  noRotationsLabel,
  onRotationIdChange,
  placeholder,
  rotationId,
  rotations,
}: Readonly<RotationSelectFieldProps>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RotationField
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        noRotationsLabel={noRotationsLabel}
        onRotationIdChange={onRotationIdChange}
        placeholder={placeholder}
        rotationId={rotationId}
        rotations={rotations}
      />
    </div>
  );
}

function RotationField({
  isLoading,
  loadingLabel,
  noRotationsLabel,
  onRotationIdChange,
  placeholder,
  rotationId,
  rotations,
}: Readonly<Omit<RotationSelectFieldProps, "label">>) {
  if (isLoading) {
    return <p className="text-xs text-muted-foreground">{loadingLabel}</p>;
  }

  if (rotations && rotations.length > 0) {
    return (
      <Select
        value={rotationId ?? undefined}
        onValueChange={onRotationIdChange}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {rotations.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return <p className="text-xs text-muted-foreground">{noRotationsLabel}</p>;
}
