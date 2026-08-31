"use client";

import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wowlab/shared/components/ui/dialog";

import type { JournalEncounter, JournalSource } from "./types";

import { DifficultyChecklist } from "./difficulty-checklist";
import { EncounterChecklist } from "./encounter-checklist";
import { ExportPresetsBar } from "./export-presets-bar";
import { LuaPreview } from "./lua-preview";
import { useExportMenu } from "./use-export-menu";

type ExportMenuProps = {
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
};

export function ExportMenu({
  selectedEncounter,
  selectedSource,
}: Readonly<ExportMenuProps>) {
  const content = useIntlayer("journalPage");
  const {
    difficultyGroups,
    files,
    handleDifficultyToggle,
    handleOpenChange,
    handlePrepare,
    isFetching,
    isStale,
    lua,
    open,
    selectedDifficultyKeys,
    selectedEncounterKeys,
    selectionSummary,
    setSelectedDifficultyKeys,
    setSelectedEncounterKeys,
    sources,
    targets,
  } = useExportMenu({ selectedEncounter, selectedSource });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {content.exportButton}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(840px,calc(100vh-2rem))] overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{content.exportDialogTitle}</DialogTitle>
          <DialogDescription>
            {content.exportDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <ExportPresetsBar
          difficultyGroups={difficultyGroups}
          selectedEncounter={selectedEncounter}
          selectedSource={selectedSource}
          selectionSummary={selectionSummary}
          sources={sources}
          onSelectDifficultyKeys={setSelectedDifficultyKeys}
          onSelectEncounterKeys={setSelectedEncounterKeys}
        />

        <div className="grid min-h-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <DifficultyChecklist
            groups={difficultyGroups}
            selected={selectedDifficultyKeys}
            onToggle={handleDifficultyToggle}
          />
          <EncounterChecklist
            selected={selectedEncounterKeys}
            sources={sources}
            onSelect={setSelectedEncounterKeys}
          />
        </div>

        <LuaPreview
          canPrepare={targets.length > 0}
          files={files}
          isFetching={isFetching}
          isStale={isStale}
          lua={lua}
          onPrepare={handlePrepare}
        />
      </DialogContent>
    </Dialog>
  );
}
