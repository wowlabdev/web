"use client";

import { useIntlayer } from "next-intlayer";

import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { ActionEntry } from "../types";

type TrinketFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function TrinketFields({
  draft,
  onChange,
}: Readonly<TrinketFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldSlotLabel}</Label>
      <Select
        value={String(draft.slot ?? 1)}
        onValueChange={(s) => onChange({ slot: Number.parseInt(s) })}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">{content.slotTrinket1}</SelectItem>
          <SelectItem value="2">{content.slotTrinket2}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
