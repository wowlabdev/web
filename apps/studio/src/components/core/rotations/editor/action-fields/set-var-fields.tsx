"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import type { ActionEntry } from "../types";

type SetVarFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function SetVarFields({ draft, onChange }: Readonly<SetVarFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldVariableNameLabel}</Label>
      <Input
        value={draft.name ?? ""}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder={content.fieldVariableNamePlaceholder.value}
      />
    </div>
  );
}
