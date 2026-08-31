"use client";

import { PlayIcon, SnowflakeIcon, StarIcon, Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { SavedCharacter } from "@/lib/user-data";

import { CharacterPanel } from "@/components/shared/character";
import { RelativeTime } from "@wowlab/shared/components/common/relative-time";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card } from "@wowlab/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wowlab/shared/components/ui/dialog";
import { Item, ItemGroup } from "@wowlab/shared/components/ui/item";
import { cn } from "@wowlab/shared/lib/utils";

import { ResolvedCharacter } from "./resolved-character";
import { useSimcProfile } from "./use-simc-profile";

type CharacterDetailProps = {
  character: SavedCharacter;
  isActive: boolean;
  isFrozen: boolean;
  onDelete: () => void;
  onSetActive: () => void;
  onSim: () => void;
  onToggleFreeze: () => void;
};

export function CharacterDetail({
  character,
  isActive,
  isFrozen,
  onDelete,
  onSetActive,
  onSim,
  onToggleFreeze,
}: Readonly<CharacterDetailProps>) {
  const content = useIntlayer("characterPage");
  const [snapshotIndex, setSnapshotIndex] = useState(0);

  const index = Math.min(snapshotIndex, character.snapshots.length - 1);
  const profile = useSimcProfile(character.snapshots.at(index)?.simc);
  const hasHistory = character.snapshots.length > 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onSim} size="sm" type="button">
          <PlayIcon className="size-3.5" />
          {content.actionSim}
        </Button>
        <Button
          disabled={isActive}
          onClick={onSetActive}
          size="sm"
          type="button"
          variant="outline"
        >
          <StarIcon className="size-3.5" />
          {content.actionSetActive}
        </Button>
        <Button
          onClick={onToggleFreeze}
          size="sm"
          type="button"
          variant="outline"
        >
          <SnowflakeIcon className="size-3.5" />
          {isFrozen ? content.actionUnfreeze : content.actionFreeze}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" type="button" variant="outline">
              {content.resolvedTitle}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{content.resolvedTitle}</DialogTitle>
            </DialogHeader>
            <ResolvedCharacter profile={profile} specId={character.specId} />
          </DialogContent>
        </Dialog>
        <Button
          aria-label={content.actionDelete.value}
          className="text-muted-foreground hover:text-destructive ml-auto"
          onClick={onDelete}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>

      {profile ? (
        <CharacterPanel
          profile={profile}
          specId={character.specId}
          variant="full"
        />
      ) : null}

      {hasHistory ? (
        <Card>
          <ItemGroup>
            {character.snapshots.map((snapshot, i) => (
              <Item
                asChild
                className={cn("rounded-none", i === index && "bg-muted/50")}
                key={snapshot.importedAt}
                size="sm"
              >
                <button onClick={() => setSnapshotIndex(i)} type="button">
                  <span className="text-muted-foreground">
                    {content.snapshotImported}
                  </span>
                  <RelativeTime at={snapshot.importedAt} />
                  {i === 0 ? (
                    <Badge className="ml-auto" variant="outline">
                      {content.snapshotsCurrent}
                    </Badge>
                  ) : null}
                </button>
              </Item>
            ))}
          </ItemGroup>
        </Card>
      ) : null}
    </div>
  );
}
