"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useDifficultyLabels } from "@/components/shared/game";
import { SafeImage } from "@wowlab/shared/components/common/safe-image";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { CardDescription, CardTitle } from "@wowlab/shared/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@wowlab/shared/components/ui/input-group";

import type { DifficultyScope, JournalEncounter, JournalSource } from "./types";
type LootGridHeaderProps = {
  filteredCount: number;
  media: {
    encounterImageUrl: null | string;
    instanceBackgroundUrl: null | string;
  };
  onSearchChange: (value: string) => void;
  scope: DifficultyScope;
  search: string;
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
  totalCount: number;
};

export function LootGridHeader({
  filteredCount,
  media,
  onSearchChange,
  scope,
  search,
  selectedEncounter,
  selectedSource,
  totalCount,
}: Readonly<LootGridHeaderProps>) {
  const content = useIntlayer("journalPage");
  const labels = useDifficultyLabels();

  return (
    <div className="relative isolate grid gap-2 pb-3 xl:grid-cols-[1fr_auto] xl:items-start">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <SafeImage
          alt=""
          className="h-full w-full object-cover opacity-20 saturate-125"
          fill
          src={media.instanceBackgroundUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/60" />
      </div>

      <div className="flex min-w-0 gap-3">
        <SafeImage
          alt=""
          className="mt-0.5 size-16 shrink-0 border bg-muted object-cover"
          height={64}
          src={media.encounterImageUrl}
          width={64}
        />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{selectedEncounter.name}</CardTitle>
            <Badge variant="outline">{labels[scope]}</Badge>
          </div>
          <CardDescription>
            {content.lootDropsSummary({
              count: totalCount,
              filtered: filteredCount,
              source: selectedSource.name,
              total: totalCount,
            })}
          </CardDescription>
        </div>
      </div>

      <InputGroup className="h-7 min-w-48 xl:w-64">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={content.searchLootPlaceholder.value}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </InputGroup>
    </div>
  );
}
