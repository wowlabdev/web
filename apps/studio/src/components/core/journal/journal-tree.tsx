"use client";

import { ChevronDown, Search } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@wowlab/shared/components/ui/input-group";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";

import type { JournalEncounter, JournalSource } from "./types";

import { ARCHIVE_PAGE_SIZE, buildJournalTreeModel } from "./journal-tree-model";
import { JournalTreeRowView } from "./journal-tree-row-view";
type JournalTreeProps = {
  onEncounterSelect: (
    source: JournalSource,
    encounter: JournalEncounter,
  ) => void;
  onSourceSelect: (source: JournalSource) => void;
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
  sources: JournalSource[];
};

export function JournalTree({
  onEncounterSelect,
  onSourceSelect,
  selectedEncounter,
  selectedSource,
  sources,
}: Readonly<JournalTreeProps>) {
  const content = useIntlayer("journalPage");
  const [query, setQuery] = useState("");
  const [archiveLimit, setArchiveLimit] = useState(0);
  const currentCount = sources.filter(
    (source) => source.isCurrentSeason,
  ).length;
  const tree = useMemo(
    () => buildJournalTreeModel({ archiveLimit, query, sources }),
    [archiveLimit, query, sources],
  );

  return (
    <Card
      id="tour-journal-tree"
      size="sm"
      className="flex max-h-[calc(100dvh-2rem)] flex-col self-start shadow-none lg:sticky lg:top-4"
    >
      <CardHeader className="space-y-3 pb-3">
        <div>
          <CardTitle>{content.sidebarTitle}</CardTitle>
          <CardDescription>
            {query.trim()
              ? content.matchingEncounters(tree.matchingEncounterCount)
              : content.currentSeasonCount(currentCount)}
          </CardDescription>
        </div>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label={content.searchSidebarAriaLabel.value}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={content.searchSidebarPlaceholder.value}
            value={query}
          />
        </InputGroup>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 pr-3">
        <ScrollArea className="h-full">
          <nav aria-label={content.encounterListAriaLabel.value}>
            <ul className="space-y-1 pb-2">
              {tree.rows.length > 0 ? (
                tree.rows.map((row) => (
                  <JournalTreeRowView
                    key={row.id}
                    onEncounterSelect={onEncounterSelect}
                    onSourceSelect={onSourceSelect}
                    row={row}
                    selectedEncounter={selectedEncounter}
                    selectedSource={selectedSource}
                  />
                ))
              ) : (
                <li>
                  <Empty className="p-4">
                    <EmptyHeader>
                      <EmptyTitle>{content.noSearchResults}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </li>
              )}
              {tree.hiddenArchiveCount > 0 ? (
                <li>
                  <Button
                    className="w-full justify-between"
                    onClick={() =>
                      setArchiveLimit((current) => current + ARCHIVE_PAGE_SIZE)
                    }
                    size="sm"
                    variant="outline"
                  >
                    <ChevronDown />
                    <span>{content.loadOlderExpansions}</span>
                    <span className="text-muted-foreground">
                      {content.remainingCount(tree.hiddenArchiveCount)}
                    </span>
                  </Button>
                </li>
              ) : null}
            </ul>
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
