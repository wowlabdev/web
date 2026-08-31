"use client";

import { useBoolean } from "ahooks";
import { LayoutGridIcon, PlusIcon, UsersIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { SavedCharacter } from "@/lib/user-data";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";

import { CharacterChip } from "./character-chip";
import { CharacterDetail } from "./character-detail";
import { CharacterImportDialog } from "./character-import";
import { CharacterSwitcher } from "./character-switcher";
import { useCharacterRoster } from "./use-character-roster";

const MAX_VISIBLE = 4;

export function CharacterContent() {
  const content = useIntlayer("characterPage");
  const {
    activeId,
    effectiveSelectedId,
    frozenId,
    isLoading,
    list,
    onDelete,
    onSetActive,
    onSim,
    onToggleFreeze,
    selected,
    setSelectedId,
  } = useCharacterRoster();

  const [
    rosterOpen,
    { set: setRosterOpen, setFalse: closeRoster, setTrue: openRoster },
  ] = useBoolean(false);

  const renderChip = (character: SavedCharacter) => (
    <CharacterChip
      character={character}
      isActive={character.id === activeId}
      isFrozen={character.id === frozenId}
      isSelected={character.id === effectiveSelectedId}
      key={character.id}
      onDelete={() => void onDelete(character)}
      onSelect={() => {
        setSelectedId(character.id);
        closeRoster();
      }}
      onSetActive={() => onSetActive(character.id)}
      onSim={() => onSim(character)}
      onToggleFreeze={() => onToggleFreeze(character.id)}
    />
  );

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        <CharacterSwitcher>
          {Array.from({ length: MAX_VISIBLE }, (_, index) => (
            <Skeleton className="h-14 w-52 shrink-0 rounded-md" key={index} />
          ))}
        </CharacterSwitcher>
        <Skeleton className="h-96 rounded-none" />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        <CharacterSwitcher>
          <p className="text-muted-foreground px-1 py-3 text-xs">
            {content.emptyDescription}
          </p>
        </CharacterSwitcher>
        <Empty className="rounded-none border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle>{content.emptyTitle}</EmptyTitle>
            <EmptyDescription>{content.emptyDescription}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CharacterImportDialog
              trigger={
                <Button type="button">
                  <PlusIcon className="size-3.5" />
                  {content.importButton}
                </Button>
              }
            />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const overflowing = list.length > MAX_VISIBLE;
  const visible =
    overflowing && selected && list.indexOf(selected) >= MAX_VISIBLE
      ? [selected, ...list.filter((c) => c.id !== selected.id)].slice(
          0,
          MAX_VISIBLE,
        )
      : list.slice(0, MAX_VISIBLE);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
      <CharacterSwitcher
        action={
          overflowing ? (
            <Button
              className="text-muted-foreground"
              onClick={openRoster}
              size="sm"
              type="button"
              variant="ghost"
            >
              <LayoutGridIcon className="size-3.5" />
              {content.rosterButton({ count: list.length })}
            </Button>
          ) : null
        }
      >
        {visible.map((character) => renderChip(character))}
      </CharacterSwitcher>

      <Dialog onOpenChange={setRosterOpen} open={rosterOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{content.listTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto">
            {list.map((character) => renderChip(character))}
          </div>
        </DialogContent>
      </Dialog>

      {selected ? (
        <CharacterDetail
          character={selected}
          isActive={selected.id === activeId}
          isFrozen={selected.id === frozenId}
          key={selected.id}
          onDelete={() => void onDelete(selected)}
          onSetActive={() => onSetActive(selected.id)}
          onSim={() => onSim(selected)}
          onToggleFreeze={() => onToggleFreeze(selected.id)}
        />
      ) : (
        <p className="text-muted-foreground text-sm">{content.selectPrompt}</p>
      )}
    </div>
  );
}
