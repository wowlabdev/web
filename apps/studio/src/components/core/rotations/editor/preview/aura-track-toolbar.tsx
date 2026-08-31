"use client";

import { useMemoizedFn } from "ahooks";
import { ArrowUpDownIcon, SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { Input } from "@wowlab/shared/components/ui/input";

import type { AuraSort } from "./use-aura-lanes";

type AuraTrackToolbarProps = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: AuraSort) => void;
  search: string;
  sort: AuraSort;
};

const SORT_VALUES: readonly AuraSort[] = ["first", "uptime", "name"] as const;

export function AuraTrackToolbar({
  onSearchChange,
  onSortChange,
  search,
  sort,
}: Readonly<AuraTrackToolbarProps>) {
  const content = useIntlayer("rotationEditor");
  const handleSort = useMemoizedFn((next: string) => {
    onSortChange(
      SORT_VALUES.includes(next as AuraSort) ? (next as AuraSort) : "first",
    );
  });

  const sortLabels: Record<AuraSort, string> = {
    first: content.previewAurasSortFirst.value,
    name: content.previewAurasSortName.value,
    uptime: content.previewAurasSortUptime.value,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-8 pl-8"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={content.previewAurasSearchPlaceholder.value}
          value={search}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <ArrowUpDownIcon />
            <span className="hidden md:inline">{sortLabels[sort]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {content.previewAurasSortMenuTitle}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup onValueChange={handleSort} value={sort}>
            <DropdownMenuRadioItem value="first">
              {content.previewAurasSortFirst}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="uptime">
              {content.previewAurasSortUptime}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">
              {content.previewAurasSortName}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
