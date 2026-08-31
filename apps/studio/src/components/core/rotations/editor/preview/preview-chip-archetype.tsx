"use client";

import { useMemoizedFn } from "ahooks";
import { CrosshairIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { PreviewFightStyle } from "./constants";

type PreviewChipArchetypeProps = {
  onChange: (archetype: PreviewFightStyle) => void;
  value: PreviewFightStyle;
};

export function PreviewChipArchetype({
  onChange,
  value,
}: Readonly<PreviewChipArchetypeProps>) {
  const content = useIntlayer("rotationEditor");
  const handleChange = useMemoizedFn((next: string) => {
    onChange(next as PreviewFightStyle);
  });

  const labels: Record<PreviewFightStyle, string> = {
    FixedMulti2: content.previewArchetypeMulti2.value,
    FixedMulti5: content.previewArchetypeMulti5.value,
    Patchwerk: content.previewArchetypePatchwerk.value,
    Single: content.previewArchetypeSingle.value,
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 font-normal">
          <CrosshairIcon className="size-3.5" />
          {labels[value]}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <Label className="text-xs">{content.previewControlArchetype}</Label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">
              {content.previewArchetypeSingle}
            </SelectItem>
            <SelectItem value="FixedMulti2">
              {content.previewArchetypeMulti2}
            </SelectItem>
            <SelectItem value="FixedMulti5">
              {content.previewArchetypeMulti5}
            </SelectItem>
            <SelectItem value="Patchwerk">
              {content.previewArchetypePatchwerk}
            </SelectItem>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
}
