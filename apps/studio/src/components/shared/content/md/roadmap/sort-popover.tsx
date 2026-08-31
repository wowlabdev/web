"use client";

import { ArrowUpDownIcon, CheckCircle2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { SortMode } from "@/lib/github/types";

import { SORT_OPTIONS } from "@/lib/github/sort-issues";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";

type SortPopoverProps = {
  onChange: (mode: SortMode) => void;
  sortMode: SortMode;
};

export function SortPopover({
  onChange,
  sortMode,
}: Readonly<SortPopoverProps>) {
  const { roadmap: content } = useIntlayer("article");
  const selectedLabelKey = SORT_OPTIONS.find(
    (option) => option.value === sortMode,
  )?.labelKey;
  const selectedLabel = selectedLabelKey
    ? content.sort[selectedLabelKey].value
    : content.sortFallback.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={content.sortAria({ label: selectedLabel }).value}
          title={content.sortTitle({ label: selectedLabel }).value}
        >
          <ArrowUpDownIcon className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>{content.sortIssues}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <span className="whitespace-nowrap">
                {content.sort[option.labelKey]}
              </span>
              {sortMode === option.value ? (
                <CheckCircle2Icon className="size-3.5 shrink-0 text-primary" />
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
