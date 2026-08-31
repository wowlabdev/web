"use client";

import type { Profile } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { GameSpec } from "@/components/shared/game";
import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

type ImportStepProps = {
  onNext: () => void;
  parseError: string | null;
  profile: Profile | null;
  setSimcInput: (val: string) => void;
  simcInput: string;
  specId: number | null;
};

export function ImportStep({
  onNext,
  parseError,
  profile,
  setSimcInput,
  simcInput,
  specId,
}: Readonly<ImportStepProps>) {
  const content = useIntlayer("simulateShared");

  return (
    <>
      <div>
        <Label htmlFor="simc-input">{content.simcInputLabel}</Label>
        <Textarea
          id="simc-input"
          className="mt-1.5 h-40 resize-y font-mono"
          placeholder={content.simcInputPlaceholder.value}
          value={simcInput}
          onChange={(e) => setSimcInput(e.target.value)}
        />
        {parseError && (
          <p className="mt-1 text-xs text-destructive">{parseError}</p>
        )}
      </div>

      {profile && specId ? (
        <div className="flex flex-wrap items-center gap-3 rounded-md border p-3 text-sm">
          <GameSpec specId={specId} />
          <span className="font-medium">{profile.character.name}</span>
          <span className="text-muted-foreground">
            {content.characterLevel({ level: profile.character.level })}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-muted-foreground">
            {content.equippedCount({ count: profile.equipment.length })}
          </span>
          <span className="text-muted-foreground">
            {content.inBagsCount({ count: profile.bagItems.length })}
          </span>
          {profile.weeklyRewards.length > 0 && (
            <span className="text-muted-foreground">
              {content.weeklyCount({ count: profile.weeklyRewards.length })}
            </span>
          )}
        </div>
      ) : null}

      {profile && (
        <div className="flex justify-end">
          <Button onClick={onNext}>{content.next}</Button>
        </div>
      )}
    </>
  );
}
