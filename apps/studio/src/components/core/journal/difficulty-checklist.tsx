"use client";

import { useIntlayer } from "next-intlayer";

import {
  difficultyKeyLabel,
  type LootSourceKind,
} from "@/lib/game/difficulty-bonus";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";

export type DifficultyChecklistGroup = {
  difficultyKeys: string[];
  sourceKind: LootSourceKind;
};

type DifficultyChecklistProps = {
  groups: DifficultyChecklistGroup[];
  selected: Set<string>;
  onToggle: (difficultyKey: string, checked: boolean) => void;
};

export function DifficultyChecklist({
  groups,
  onToggle,
  selected,
}: Readonly<DifficultyChecklistProps>) {
  const content = useIntlayer("journalPage");

  return (
    <div className="space-y-3 border p-3">
      <div className="space-y-1">
        <p className="font-medium">{content.exportDifficultiesTitle}</p>
        <p className="text-[11px] text-muted-foreground">
          {content.exportDifficultiesHint}
        </p>
      </div>
      <div className="space-y-3">
        {groups.map((group) =>
          group.difficultyKeys.length === 0 ? null : (
            <div key={group.sourceKind} className="space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {group.sourceKind === "raid"
                  ? content.tabRaids
                  : content.tabDungeons}
              </p>
              <div className="grid gap-2">
                {group.difficultyKeys.map((difficultyKey) => (
                  <label
                    key={difficultyKey}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selected.has(difficultyKey)}
                      onCheckedChange={(checked) =>
                        onToggle(difficultyKey, !!checked)
                      }
                    />
                    {difficultyKeyLabel(difficultyKey)}
                  </label>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
