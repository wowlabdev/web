"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import type { ActionEntry } from "../types";

type ItemFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function ItemFields({ draft, onChange }: Readonly<ItemFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldItemNameLabel}</Label>
      <Input
        value={draft.name ?? ""}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder={content.fieldItemNamePlaceholder.value}
      />
    </div>
  );
}
