"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { ActionEntry } from "../types";

type ListFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
  listNames: string[];
};

export function ListFields({
  draft,
  listNames,
  onChange,
}: Readonly<ListFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldListLabel}</Label>
      {listNames.length > 0 ? (
        <Select
          value={draft.list ?? ""}
          onValueChange={(list) => onChange({ list })}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={content.fieldListSelectPlaceholder.value}
            />
          </SelectTrigger>
          <SelectContent>
            {listNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={draft.list ?? ""}
          onChange={(e) => onChange({ list: e.target.value })}
          placeholder={content.fieldListPlaceholder.value}
        />
      )}
    </div>
  );
}
