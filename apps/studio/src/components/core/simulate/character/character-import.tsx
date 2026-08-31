"use client";

import { useBoolean, useLockFn, useMemoizedFn } from "ahooks";
import { PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { type ReactNode, useState } from "react";

import type { ParseSimcError } from "@/lib/sim/parse-simc";

import { useCommon } from "@/components/shared/wasm";
import { parseAndValidateSimc } from "@/lib/sim/parse-simc";
import { useCharacterStore } from "@/lib/state/character-store";
import { upsertSavedCharacter } from "@/lib/user-data";
import { parseImplementedSpecs } from "@/lib/wasm/api";
import { getEngine } from "@/lib/wasm/loaders/engine";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wowlab/shared/components/ui/dialog";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

type CharacterImportDialogProps = {
  trigger?: ReactNode;
};

export function CharacterImportDialog({
  trigger,
}: Readonly<CharacterImportDialogProps>) {
  const content = useIntlayer("characterPage");
  const common = useCommon();
  const [open, { set: setOpen, setFalse: closeDialog }] = useBoolean(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const errorMessage = useMemoizedFn((reason: ParseSimcError): string => {
    switch (reason.type) {
      case "cannotDetectSpec": {
        return content.importErrorNoSpec.value;
      }

      case "parseFailed": {
        return content.importErrorParse.value;
      }

      case "specNotSupported": {
        return content.importErrorUnsupported({ id: reason.specId }).value;
      }
    }
  });

  const onImport = useLockFn(async () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const engine = await getEngine();
    const implementedSpecIds = new Set(
      parseImplementedSpecs(common, engine.getImplementedSpecs()).map(
        (spec) => spec.spec_id,
      ),
    );
    const result = parseAndValidateSimc(common, implementedSpecIds, trimmed);

    if (!result.ok) {
      setError(errorMessage(result.error));

      return;
    }

    setError(null);

    try {
      const saved = await upsertSavedCharacter({
        profile: result.profile,
        rawSimc: trimmed,
        specId: result.specId,
      });
      const character = useCharacterStore.getState();

      if (!character.frozenCharacterId) {
        character.setActive(saved.id);
      }

      setDraft("");
      closeDialog();
    } catch {
      setError(content.importErrorParse.value);
    }
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" type="button" variant="outline">
            <PlusIcon className="size-3.5" />
            {content.importButton}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.importTitle}</DialogTitle>
          <DialogDescription>{content.importDescription}</DialogDescription>
        </DialogHeader>
        <Textarea
          className="min-h-48 font-mono text-xs"
          onChange={(event) => setDraft(event.target.value)}
          placeholder={content.importPlaceholder.value}
          value={draft}
        />
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <DialogFooter>
          <Button onClick={() => void onImport()} type="button">
            {content.importButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
