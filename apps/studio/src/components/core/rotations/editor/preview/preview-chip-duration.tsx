"use client";

import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { ClockIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import { Slider } from "@wowlab/shared/components/ui/slider";

type PreviewChipDurationProps = {
  onChange: (durationS: number) => void;
  value: number;
};

export function PreviewChipDuration({
  onChange,
  value,
}: Readonly<PreviewChipDurationProps>) {
  const content = useIntlayer("rotationEditor");
  const [draft, setDraft] = useState(value);

  useUpdateEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- resync editable local draft when the committed prop value changes externally
    setDraft(value);
  }, [value]);

  const handleSlide = useMemoizedFn((values: number[]) => {
    const next = values[0];

    if (typeof next === "number") {
      setDraft(next);
    }
  });

  const handleCommit = useMemoizedFn((values: number[]) => {
    const next = values[0];

    if (typeof next === "number" && next !== value) {
      onChange(next);
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 font-normal">
          <ClockIcon className="size-3.5" />
          {content.previewChipDurationValue({ seconds: draft })}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <Label className="text-xs">
          {content.previewControlDuration({ seconds: draft })}
        </Label>
        <Slider
          min={30}
          max={300}
          step={5}
          value={[draft]}
          onValueChange={handleSlide}
          onValueCommit={handleCommit}
        />
      </PopoverContent>
    </Popover>
  );
}
