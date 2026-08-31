"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { SavedCharacter } from "@/lib/user-data";

import { useConfirm } from "@/components/shared/ui/confirm-dialog";
import { useSimulatorStore } from "@/lib/state";
import {
  useCharacterStore,
  useEffectiveActiveId,
} from "@/lib/state/character-store";
import { deleteSavedCharacter, useSavedCharacters } from "@/lib/user-data";
import { href, routes, useLocalizedRouter } from "@wowlab/shared/lib/routing";

export function useCharacterRoster() {
  const content = useIntlayer("characterPage");
  const router = useLocalizedRouter();
  const confirm = useConfirm();

  const { data: characters, isLoading } = useSavedCharacters();
  const activeId = useEffectiveActiveId();
  const frozenId = useCharacterStore((s) => s.frozenCharacterId);
  const setActive = useCharacterStore((s) => s.setActive);
  const freeze = useCharacterStore((s) => s.freeze);
  const unfreeze = useCharacterStore((s) => s.unfreeze);
  const handleDeleted = useCharacterStore((s) => s.handleDeleted);
  const setSimcInput = useSimulatorStore((s) => s.setSimcInput);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = characters ?? [];
  const effectiveSelectedId = selectedId ?? activeId ?? list.at(0)?.id ?? null;
  const selected = list.find((c) => c.id === effectiveSelectedId) ?? null;

  const onSim = useMemoizedFn((character: SavedCharacter) => {
    const simc = character.snapshots.at(0)?.simc;

    if (!simc) {
      return;
    }

    setSimcInput(simc);
    router.push(href(routes.simulate.quick));
  });

  const onDelete = useMemoizedFn(async (character: SavedCharacter) => {
    const confirmed = await confirm({
      confirmLabel: content.actionDelete.value,
      description: content.deleteDescription({ name: character.name }).value,
      isDestructive: true,
      title: content.deleteTitle.value,
    });

    if (!confirmed) {
      return;
    }

    await deleteSavedCharacter(character.id);
    handleDeleted(character.id);

    if (selectedId === character.id) {
      setSelectedId(null);
    }
  });

  const onToggleFreeze = useMemoizedFn((id: string) => {
    if (frozenId === id) {
      unfreeze();
    } else {
      freeze(id);
    }
  });

  return {
    activeId,
    effectiveSelectedId,
    frozenId,
    isLoading,
    list,
    onDelete,
    onSetActive: setActive,
    onSim,
    onToggleFreeze,
    selected,
    setSelectedId,
  };
}
