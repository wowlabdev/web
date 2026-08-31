"use client";

import { UsersIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";

import { useNumericDraft } from "./use-numeric-draft";
type PreviewChipTargetsProps = {
  onChange: (targetCount: number) => void;
  value: number;
};
const MIN = 1;
const MAX = 10;

export function PreviewChipTargets({
  onChange,
  value,
}: Readonly<PreviewChipTargetsProps>) {
  const content = useIntlayer("rotationEditor");
  const { draft, handleKeyDown, onBlur, setDraft } = useNumericDraft({
    normalize: (n) =>
      Number.isFinite(n) ? Math.min(MAX, Math.max(MIN, Math.floor(n))) : null,
    onChange,
    value,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 font-normal">
          <UsersIcon className="size-3.5" />
          {content.previewChipTargetsValue(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <Label htmlFor="preview-chip-targets" className="text-xs">
          {content.previewControlTargets}
        </Label>
        <Input
          id="preview-chip-targets"
          type="number"
          min={MIN}
          max={MAX}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          className="h-8 text-xs"
        />
      </PopoverContent>
    </Popover>
  );
}
