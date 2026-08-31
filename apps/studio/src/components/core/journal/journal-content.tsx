"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { SidebarLayout } from "@/components/shared/layout";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { useJournalList } from "@/lib/game-data";
import { useJournalLoot } from "@/lib/query/services/game";
import { HeaderPanel } from "@wowlab/shared/components/common/header-panel";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";

import { toJournalSource, toLootRow } from "./data-mappers";
import { DifficultySelector } from "./difficulty-selector";
import { ExportMenu } from "./export-menu";
import { getJournalMedia } from "./journal-media";
import { JournalTabs } from "./journal-tabs";
import { JournalTree } from "./journal-tree";
import { LootGrid } from "./loot-grid";
import { useJournalQuery } from "./use-journal-query";
import { useJournalSelection } from "./use-journal-selection";

export function JournalContent() {
  const content = useIntlayer("journalPage");
  const { query, setQuery } = useJournalQuery();
  const { difficulty: difficultyScope, q: search, tab: contentType } = query;
  const sourceKind = contentType === "raids" ? "raid" : "dungeon";
  const { data: journalInstances = [], isLoading: instancesLoading } =
    useJournalList(sourceKind);
  const sources = useMemo(
    () => journalInstances.map((instance) => toJournalSource(instance)),
    [journalInstances],
  );
  const { allowedDifficulties, selectedEncounter, selectedSource } =
    useJournalSelection(sources, query, setQuery);
  const { data: journalLoot = [], isLoading: lootLoading } = useJournalLoot({
    difficulty: difficultyScope,
    encounterId: selectedEncounter?.id ?? 0,
    instanceId: selectedSource?.instanceId ?? 0,
    isMythicPlus: selectedSource?.isMythicPlus ?? false,
    sourceKind,
  });
  const selectedLoot = useMemo(
    () =>
      selectedSource && selectedEncounter
        ? journalLoot.map((item) =>
            toLootRow(item, selectedSource, selectedEncounter),
          )
        : [],
    [journalLoot, selectedEncounter, selectedSource],
  );
  const filteredLoot = useFuzzySearch({
    items: selectedLoot,
    keys: ["encounter", "itemId", "slot", "source", "track", "type"],
    query: search,
  });
  const media = getJournalMedia(selectedSource, selectedEncounter);

  if (!selectedSource) {
    return (
      <JournalEmptyState
        message={
          instancesLoading
            ? content.loadingEncounters.value
            : content.noInstances.value
        }
      />
    );
  }

  if (!selectedEncounter) {
    return (
      <JournalEmptyState
        message={content.noEncountersFor({ source: selectedSource.name }).value}
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPanel
        railColor="purple"
        title={content.title.value}
        description={content.description.value}
        actions={
          <ExportMenu
            selectedEncounter={selectedEncounter}
            selectedSource={selectedSource}
          />
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border bg-card p-3">
        <JournalTabs
          value={contentType}
          onChange={(tab) => {
            setQuery({ tab });
          }}
        />
        <DifficultySelector
          allowed={allowedDifficulties}
          value={difficultyScope}
          onChange={(difficulty) => {
            setQuery({ difficulty });
          }}
        />
      </div>
      <SidebarLayout as="section">
        <JournalTree
          sources={sources}
          selectedEncounter={selectedEncounter}
          selectedSource={selectedSource}
          onEncounterSelect={(source, encounter) => {
            setQuery({ encounter: String(encounter.id), instance: source.id });
          }}
          onSourceSelect={(source) => {
            const firstEncounter = source.encounters.at(0);

            setQuery({
              encounter: firstEncounter ? String(firstEncounter.id) : "",
              instance: source.id,
            });
          }}
        />
        <LootGrid
          filteredCount={filteredLoot.length}
          loot={filteredLoot}
          isLoading={lootLoading}
          media={media}
          onSearchChange={(q) => {
            setQuery({ q });
          }}
          search={search}
          scope={difficultyScope}
          selectedEncounter={selectedEncounter}
          selectedSource={selectedSource}
          totalCount={selectedLoot.length}
        />
      </SidebarLayout>
    </div>
  );
}

function JournalEmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{message}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
