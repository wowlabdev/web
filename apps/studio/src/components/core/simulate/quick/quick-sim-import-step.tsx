"use client";

import type { Profile } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { GameSpec } from "@/components/shared/game";
import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

type QuickSimImportStepProps = {
  onNext: () => void;
  onSimcInputChange: (value: string) => void;
  parseError: string | null;
  profile: Profile | null;
  simcInput: string;
  specId: number | null;
};

export function QuickSimImportStep({
  onNext,
  onSimcInputChange,
  parseError,
  profile,
  simcInput,
  specId,
}: Readonly<QuickSimImportStepProps>) {
  const shared = useIntlayer("simulateShared");

  return (
    <>
      <div>
        <Label htmlFor="simc-input">{shared.simcInputLabel}</Label>
        <Textarea
          id="simc-input"
          className="mt-1.5 h-40 resize-y font-mono"
          placeholder={shared.simcInputPlaceholder.value}
          value={simcInput}
          onChange={(e) => onSimcInputChange(e.target.value)}
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
            {shared.characterLevel({
              level: profile.character.level,
            })}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-muted-foreground">
            {shared.equippedCount({
              count: profile.equipment.length,
            })}
          </span>
        </div>
      ) : null}

      {profile && (
        <div className="flex justify-end">
          <Button onClick={onNext}>{shared.next}</Button>
        </div>
      )}
    </>
  );
}
