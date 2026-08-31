"use client";

import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import type { ActionEntry } from "../types";

type CastFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
  spellSlugs: string[];
};

export function CastFields({
  draft,
  onChange,
  spellSlugs,
}: Readonly<CastFieldsProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{content.fieldSpellLabel}</Label>
      <Input
        value={draft.spell ?? ""}
        onChange={(e) => onChange({ spell: e.target.value })}
        placeholder={content.fieldSpellPlaceholder.value}
        list="editor-spell-slugs"
      />
      {spellSlugs.length > 0 && (
        <datalist id="editor-spell-slugs">
          {spellSlugs.slice(0, 100).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
