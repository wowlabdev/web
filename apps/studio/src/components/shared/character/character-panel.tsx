"use client";

import type { Profile } from "wowlab-common";

import { ShirtIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { GameSpec } from "@/components/shared/game";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Separator } from "@wowlab/shared/components/ui/separator";

import { EquipmentGrid } from "./equipment-grid";
import { useAverageItemLevel } from "./use-average-item-level";
type CharacterPanelProps = {
  profile: Profile;
  specId?: number | null;
  variant?: "full" | "summary";
};

export function CharacterPanel({
  profile,
  specId,
  variant = "full",
}: Readonly<CharacterPanelProps>) {
  const content = useIntlayer("characterPanel");
  const averageItemLevel = useAverageItemLevel(profile);
  const equippedCount = profile.equipment.length;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {specId == null ? null : <GameSpec size="md" specId={specId} />}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">
                {content.labelName}{" "}
              </span>
              <span className="font-medium">{profile.character.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {content.labelLevel}{" "}
              </span>
              <span className="font-medium">{profile.character.level}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShirtIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold leading-none">
                {averageItemLevel ?? "—"}
              </span>
              <span className="text-xs text-muted-foreground">
                {content.averageItemLevel} &middot;{" "}
                {content.itemsEquipped(equippedCount)}
              </span>
            </div>
          </div>
        </div>
        {variant === "full" ? (
          <>
            <Separator />
            <EquipmentGrid profile={profile} />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
