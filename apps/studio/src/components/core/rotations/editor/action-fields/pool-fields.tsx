"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import type { ActionEntry } from "../types";

type PoolFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function PoolFields({ draft, onChange }: Readonly<PoolFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldExtraResourceLabel}</Label>
      <Input
        type="number"
        step="1"
        value={draft.extra ?? 0}
        onChange={(e) =>
          onChange({ extra: Number.parseFloat(e.target.value) || 0 })
        }
      />
    </div>
  );
}
