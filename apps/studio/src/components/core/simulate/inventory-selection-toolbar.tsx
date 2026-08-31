"use client";

import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { Label } from "@wowlab/shared/components/ui/label";
import { Separator } from "@wowlab/shared/components/ui/separator";

type InventorySelectionToolbarProps = {
  onDeselectAll: () => void;
  onSelectAll: () => void;
  onToggleIncludeWeekly: (next: boolean) => void;
  shouldIncludeWeekly: boolean;
};

export function InventorySelectionToolbar({
  onDeselectAll,
  onSelectAll,
  onToggleIncludeWeekly,
  shouldIncludeWeekly,
}: Readonly<InventorySelectionToolbarProps>) {
  const content = useIntlayer("simulateShared");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="include-weekly"
          checked={shouldIncludeWeekly}
          onCheckedChange={(checked) => onToggleIncludeWeekly(!!checked)}
        />
        <Label htmlFor="include-weekly">{content.includeWeeklyRewards}</Label>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="outline" size="sm" onClick={onSelectAll}>
        {content.selectAll}
      </Button>
      <Button variant="outline" size="sm" onClick={onDeselectAll}>
        {content.selectDeselectAll}
      </Button>
    </div>
  );
}
