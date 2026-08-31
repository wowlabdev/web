"use client";

import {
  MoreHorizontalIcon,
  PlayIcon,
  SnowflakeIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { SavedCharacter } from "@/lib/user-data";

import { useAverageItemLevel } from "@/components/shared/character";
import { GameSpec } from "@/components/shared/game";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { cn } from "@wowlab/shared/lib/utils";

import { useSimcProfile } from "./use-simc-profile";

type CharacterChipProps = {
  character: SavedCharacter;
  isActive: boolean;
  isFrozen: boolean;
  isSelected: boolean;
  onDelete: () => void;
  onSelect: () => void;
  onSetActive: () => void;
  onSim: () => void;
  onToggleFreeze: () => void;
};

export function CharacterChip({
  character,
  isActive,
  isFrozen,
  isSelected,
  onDelete,
  onSelect,
  onSetActive,
  onSim,
  onToggleFreeze,
}: Readonly<CharacterChipProps>) {
  const content = useIntlayer("characterPage");
  const profile = useSimcProfile(character.snapshots.at(0)?.simc);
  const itemLevel = useAverageItemLevel(profile);

  return (
    <div
      className={cn(
        "relative w-52 shrink-0 rounded-md border transition-colors",
        isSelected
          ? "border-primary bg-muted/40"
          : "border-border hover:bg-muted/30",
      )}
    >
      <button
        aria-pressed={isSelected}
        className="flex w-full flex-col gap-1 p-2.5 pr-9 text-left outline-none focus-visible:underline"
        onClick={onSelect}
        onDoubleClick={onSetActive}
        type="button"
      >
        <span className="flex items-center gap-1.5 overflow-hidden">
          <span className="truncate text-xs font-medium">{character.name}</span>
          {isActive ? (
            <Badge className="h-4 shrink-0 px-1.5 text-[10px] leading-none">
              {content.badgeActive}
            </Badge>
          ) : null}
          {isFrozen ? (
            <Badge
              className="h-4 shrink-0 px-1.5 text-[10px] leading-none"
              variant="outline"
            >
              {content.badgeFrozen}
            </Badge>
          ) : null}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 overflow-hidden text-xs">
          <GameSpec
            className="overflow-hidden"
            size="sm"
            specId={character.specId}
          />
          {itemLevel == null ? null : (
            <span className="shrink-0 tabular-nums">
              &middot; {content.itemLevel({ ilvl: itemLevel })}
            </span>
          )}
        </span>
      </button>

      <div className="absolute top-1 right-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={content.actionsMenu.value}
              className="text-muted-foreground"
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSim}>
              <PlayIcon className="size-3.5" />
              {content.actionSim}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isActive} onClick={onSetActive}>
              <StarIcon className="size-3.5" />
              {content.actionSetActive}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleFreeze}>
              <SnowflakeIcon className="size-3.5" />
              {isFrozen ? content.actionUnfreeze : content.actionFreeze}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} variant="destructive">
              <Trash2Icon className="size-3.5" />
              {content.actionDelete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
