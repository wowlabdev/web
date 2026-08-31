"use client";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

type IterationsFieldProps = {
  hint: string;
  iterations: number;
  label: string;
  onIterationsChange: (value: number) => void;
};

export function IterationsField({
  hint,
  iterations,
  label,
  onIterationsChange,
}: Readonly<IterationsFieldProps>) {
  return (
    <div className="space-y-2">
      <Label htmlFor="iterations-input">{label}</Label>
      <div className="flex items-center gap-3">
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
              onIterationsChange(val);
            }
          }}
          className="w-36"
        />
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}
