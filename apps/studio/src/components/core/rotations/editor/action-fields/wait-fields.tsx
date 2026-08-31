"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import type { ActionEntry } from "../types";

type WaitFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function WaitFields({ draft, onChange }: Readonly<WaitFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldSecondsLabel}</Label>
      <Input
        type="number"
        step="0.1"
        value={draft.seconds ?? 0}
        onChange={(e) =>
          onChange({ seconds: Number.parseFloat(e.target.value) || 0 })
        }
      />
    </div>
  );
}
