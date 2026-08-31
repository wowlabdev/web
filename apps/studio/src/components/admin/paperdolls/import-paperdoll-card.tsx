"use client";

import type { Profile } from "wowlab-common";

import { useCreation, useMemoizedFn } from "ahooks";
import { SaveIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { GameSpec } from "@/components/shared/game";
import { useCommon, useEngine, WasmBoundary } from "@/components/shared/wasm";
import {
  extractSpecIdFromLoadout,
  parseImplementedSpecs,
  parseSimcProfile,
} from "@/lib/wasm/api";
import {
  Skeleton,
  SkeletonField,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Label } from "@wowlab/shared/components/ui/label";
import { Textarea } from "@wowlab/shared/components/ui/textarea";
type ImportPaperdollCardProps = {
  isPending: boolean;
  onSave: (input: {
    characterName: string;
    simc: string;
    specId: number;
  }) => Promise<void>;
};

export function ImportPaperdollCard({
  isPending,
  onSave,
}: Readonly<ImportPaperdollCardProps>) {
  const content = useIntlayer("admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.paperdolls.importTitle}</CardTitle>
      </CardHeader>
      <WasmBoundary fallback={<ImportPaperdollSkeleton />}>
        <ImportPaperdollForm isPending={isPending} onSave={onSave} />
      </WasmBoundary>
    </Card>
  );
}

function ImportPaperdollForm({
  isPending,
  onSave,
}: Readonly<ImportPaperdollCardProps>) {
  const content = useIntlayer("admin");
  const common = useCommon();
  const engine = useEngine();
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<null | Profile>(null);
  const [detectedSpecId, setDetectedSpecId] = useState<null | number>(null);
  const [parseError, setParseError] = useState<null | string>(null);
  const implementedSpecIds = useCreation(() => {
    const specs = parseImplementedSpecs(common, engine.getImplementedSpecs());

    return new Set(specs.map((spec) => spec.spec_id));
  }, [common, engine]);
  const handleChange = useMemoizedFn((value: string) => {
    setInput(value);

    if (!value.trim()) {
      setProfile(null);
      setDetectedSpecId(null);
      setParseError(null);

      return;
    }

    try {
      const parsed = parseSimcProfile(common, value);
      const specId = extractSpecIdFromLoadout(common, parsed.talents.encoded);

      if (!specId) {
        setProfile(null);
        setDetectedSpecId(null);
        setParseError(content.paperdolls.errorNoSpec.value);

        return;
      }

      if (!implementedSpecIds.has(specId)) {
        setProfile(null);
        setDetectedSpecId(null);
        setParseError(
          content.paperdolls.errorUnsupportedSpec({ specId }).value,
        );

        return;
      }

      setProfile(parsed);
      setDetectedSpecId(specId);
      setParseError(null);
    } catch (error) {
      setProfile(null);
      setDetectedSpecId(null);
      setParseError(
        error instanceof Error
          ? error.message
          : content.paperdolls.parseFailed.value,
      );
    }
  });

  async function save() {
    if (profile == null || detectedSpecId == null) {
      return;
    }

    await onSave({
      characterName: profile.character.name,
      simc: input,
      specId: detectedSpecId,
    });
    setInput("");
    setProfile(null);
    setDetectedSpecId(null);
    setParseError(null);
  }

  const canSave = profile != null && detectedSpecId != null && !isPending;
  const equippedCount = profile?.equipment.length ?? 0;

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="paperdoll-simc">{content.paperdolls.importLabel}</Label>
        <Textarea
          id="paperdoll-simc"
          className="min-h-40 font-mono text-xs"
          placeholder={content.paperdolls.importPlaceholder.value}
          value={input}
          onChange={(event) => handleChange(event.target.value)}
        />
      </div>

      {parseError ? (
        <p className="text-sm text-destructive">{parseError}</p>
      ) : null}

      {profile && detectedSpecId != null ? (
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {content.paperdolls.detectedSpec}
            </span>
            <GameSpec specId={detectedSpecId} />
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium">{profile.character.name}</span>
            <span className="text-muted-foreground">
              {content.paperdolls.itemsEquipped(equippedCount)}
            </span>
          </div>
        </div>
      ) : null}

      <div>
        <Button disabled={!canSave} onClick={() => void save()}>
          <SaveIcon className="size-4" />
          {isPending ? content.paperdolls.saving : content.paperdolls.save}
        </Button>
      </div>
    </CardContent>
  );
}

function ImportPaperdollSkeleton() {
  return (
    <CardContent className="flex flex-col gap-4">
      <SkeletonField inputClassName="min-h-40" labelClassName="w-32" />
      <Skeleton className="h-9 w-24" />
    </CardContent>
  );
}
