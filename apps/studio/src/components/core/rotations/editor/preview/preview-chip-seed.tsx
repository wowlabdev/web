"use client";

import { useMemoizedFn } from "ahooks";
import { DicesIcon } from "lucide-react";
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

type PreviewChipSeedProps = {
  onChange: (seed: number) => void;
  value: number;
};

export function PreviewChipSeed({
  onChange,
  value,
}: Readonly<PreviewChipSeedProps>) {
  const content = useIntlayer("rotationEditor");
  const { draft, handleKeyDown, onBlur, setDraft } = useNumericDraft({
    normalize: (n) => (Number.isFinite(n) && n >= 1 ? Math.floor(n) : null),
    onChange,
    value,
  });

  const reroll = useMemoizedFn(() => {
    onChange(Math.max(1, Math.floor(Math.random() * 1_000_000)));
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 font-normal">
          <DicesIcon className="size-3.5" />
          {content.previewChipSeedValue({ seed: value })}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 space-y-1.5">
        <Label htmlFor="preview-chip-seed" className="text-xs">
          {content.previewControlSeed}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="preview-chip-seed"
            type="number"
            min={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs"
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={reroll}
            aria-label={content.previewControlSeedReroll.value}
          >
            <DicesIcon className="size-3.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
