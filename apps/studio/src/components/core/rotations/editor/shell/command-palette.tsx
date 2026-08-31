"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@wowlab/shared/components/ui/command";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";

import {
  useEditorDocument,
  useEditorHistory,
  useEditorUi,
} from "../editor-store-provider";
import { downloadJson } from "../lib/export-json";
import { usePreviewQuery } from "../preview/use-preview-query";
import { useEditorLayoutToolbar } from "./editor-layout";

type CommandPaletteProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({
  isOpen,
  onOpenChange,
}: Readonly<CommandPaletteProps>) {
  const content = useIntlayer("rotationEditor");
  const { copy } = useClipboard();
  const { isPreviewVisible, setPreviewVisible } = useEditorLayoutToolbar();

  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const { canRedo, canUndo, redo, undo } = useEditorHistory();
  const addList = useEditorDocument((s) => s.addList);
  const openAddAction = useEditorUi((s) => s.openAddAction);
  const { setQuery: setPreviewQuery } = usePreviewQuery();
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const slug = useEditorDocument((s) => s.metadata.slug);
  const lists = useEditorDocument((s) => s.script.lists);

  const activeListName = selectionFocus?.listId ?? null;

  const runAndClose = useMemoizedFn((fn: () => void) => {
    fn();
    onOpenChange(false);
  });

  const handleAddList = useMemoizedFn(() => {
    runAndClose(() => {
      const name = uniqueListName(lists);

      addList(name);
    });
  });

  const handleAddAction = useMemoizedFn(() => {
    if (!activeListName) {
      return;
    }

    runAndClose(() => openAddAction(activeListName));
  });

  const handleTogglePreview = useMemoizedFn(() => {
    runAndClose(() => setPreviewVisible(!isPreviewVisible));
  });

  const handleUndo = useMemoizedFn(() => {
    if (!canUndo) {
      return;
    }

    runAndClose(undo);
  });

  const handleRedo = useMemoizedFn(() => {
    if (!canRedo) {
      return;
    }

    runAndClose(redo);
  });

  const handleDiagnose = useMemoizedFn(() => {
    if (!selectionFocus) {
      return;
    }

    runAndClose(() => setPreviewQuery({ tab: "diagnose" }));
  });

  const handleExportJson = useMemoizedFn(() => {
    runAndClose(() => {
      const snapshot = dehydrate();

      downloadJson(
        `${slug.trim() || "rotation"}.json`,
        JSON.stringify(snapshot, null, 2),
      );
    });
  });

  const handleCopyJson = useMemoizedFn(() => {
    runAndClose(() => {
      const snapshot = dehydrate();

      void copy(JSON.stringify(snapshot, null, 2));
    });
  });

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={content.commandPaletteTitle.value}
      description={content.commandPaletteDescription.value}
    >
      <CommandInput placeholder={content.commandPalettePlaceholder.value} />
      <CommandList>
        <CommandEmpty>{content.commandPaletteEmpty}</CommandEmpty>
        <CommandGroup>
          <CommandItem onSelect={handleAddList}>
            {content.commandAddList}
          </CommandItem>
          <CommandItem disabled={!activeListName} onSelect={handleAddAction}>
            {content.commandAddAction}
          </CommandItem>
          <CommandItem onSelect={handleTogglePreview}>
            {content.commandTogglePreview}
          </CommandItem>
        </CommandGroup>
        <CommandGroup>
          <CommandItem disabled={!canUndo} onSelect={handleUndo}>
            {content.commandUndo}
          </CommandItem>
          <CommandItem disabled={!canRedo} onSelect={handleRedo}>
            {content.commandRedo}
          </CommandItem>
        </CommandGroup>
        {selectionFocus !== null && (
          <CommandGroup>
            <CommandItem onSelect={handleDiagnose}>
              {content.commandDiagnose}
            </CommandItem>
          </CommandGroup>
        )}
        <CommandGroup>
          <CommandItem onSelect={handleExportJson}>
            {content.commandExportJson}
          </CommandItem>
          <CommandItem onSelect={handleCopyJson}>
            {content.commandCopyJson}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function uniqueListName(existing: Record<string, unknown>): string {
  const base = "list";

  if (!(base in existing)) {
    return base;
  }

  let counter = 2;

  while (`${base}-${counter}` in existing) {
    counter += 1;
  }

  return `${base}-${counter}`;
}
