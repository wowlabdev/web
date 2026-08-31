"use client";

import { useMemoizedFn } from "ahooks";
import { ChevronDownIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { GameSpec } from "@/components/shared/game/game-spec";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";

import type { SpecPickerProps } from "./spec-picker-types";

import { SpecPickerGrid } from "./spec-picker-grid";

export function SpecPicker({
  isCompact = false,
  onChange,
  specs,
  value,
}: Readonly<SpecPickerProps>) {
  if (isCompact) {
    return (
      <SpecPickerCompact onChange={onChange} specs={specs} value={value} />
    );
  }

  return <SpecPickerGrid onChange={onChange} specs={specs} value={value} />;
}

function SpecPickerCompact({
  onChange,
  specs,
  value,
}: Readonly<Omit<SpecPickerProps, "isCompact">>) {
  const content = useIntlayer("gameComponents");
  const [open, setOpen] = useState(false);

  const select = useMemoizedFn((specId: number) => {
    onChange(specId);
    setOpen(false);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
        >
          {value == null ? (
            <span className="text-muted-foreground">{content.selectSpec}</span>
          ) : (
            <GameSpec specId={value} />
          )}
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <SpecPickerGrid dense onChange={select} specs={specs} value={value} />
      </PopoverContent>
    </Popover>
  );
}
