"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useState } from "react";

import type { AiModelOption } from "@wowlab/shared/lib/ai-contract";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@wowlab/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import { cn } from "@wowlab/shared/lib/utils";

type AiModelSelectorProps = {
  models: AiModelOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export function AiModelSelector({
  disabled,
  models,
  onChange,
  value,
}: Readonly<AiModelSelectorProps>) {
  const content = useIntlayer("aiSettings");
  const fmtNumber = useNumber();
  const [open, setOpen] = useState(false);
  const selected = models.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || models.length === 0}
          className="w-full justify-between font-normal"
        >
          <span
            className={cn("truncate", !selected && "text-muted-foreground")}
          >
            {selected ? selected.label : content.modelPlaceholder}
          </span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput placeholder={content.modelSearchPlaceholder.value} />
          <CommandList>
            <CommandEmpty>{content.modelEmpty}</CommandEmpty>
            {models.map((model) => (
              <CommandItem
                key={model.id}
                value={`${model.label} ${model.id}`}
                onSelect={() => {
                  onChange(model.id);
                  setOpen(false);
                }}
                className="flex flex-col items-start gap-1"
              >
                <div className="flex w-full items-center gap-2">
                  <CheckIcon
                    className={cn(
                      "size-4 shrink-0",
                      model.id === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate font-medium">{model.label}</span>
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {model.contextLength !== undefined && (
                    <Badge variant="secondary" className="text-[10px]">
                      {content.modelContextLabel({
                        tokens: fmtNumber(model.contextLength, {
                          notation: "compact",
                        }),
                      })}
                    </Badge>
                  )}
                  {model.pricing?.prompt !== undefined && (
                    <Badge variant="outline" className="text-[10px]">
                      {content.modelPriceLabel({
                        price: fmtNumber(
                          Number(model.pricing.prompt) * 1_000_000,
                          {
                            maximumFractionDigits: 2,
                          },
                        ),
                      })}
                    </Badge>
                  )}
                  {model.inputModalities?.map((modality) => (
                    <Badge
                      key={modality}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {modality}
                    </Badge>
                  ))}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
