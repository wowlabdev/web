"use client";

import type { Profile } from "wowlab-common";

import {
  useCreation,
  useDebounceEffect,
  useMemoizedFn,
  useMount,
  useSetState,
} from "ahooks";
import { useIntlayer } from "next-intlayer";

import { useCommon, useEngine } from "@/components/shared/wasm";
import { log } from "@/lib/observability";
import {
  parseAndValidateSimc,
  type ParseSimcError,
} from "@/lib/sim/parse-simc";
import { useSimulatorStore } from "@/lib/state";
import { useCharacterStore } from "@/lib/state/character-store";
import { upsertSavedCharacter } from "@/lib/user-data";
import { parseImplementedSpecs } from "@/lib/wasm/api";

export function useSimcParser() {
  const content = useIntlayer("simulateShared");
  const common = useCommon();
  const engine = useEngine();

  const simcInput = useSimulatorStore((s) => s.simcInput);
  const specId = useSimulatorStore((s) => s.specId);
  const setSimcInput = useSimulatorStore((s) => s.setSimcInput);

  const [state, setState] = useSetState({
    parseError: null as string | null,
    profile: null as Profile | null,
  });

  const implementedSpecNames = useCreation(() => {
    const specs = parseImplementedSpecs(common, engine.getImplementedSpecs());

    return new Map(specs.map((spec) => [spec.spec_id, spec.display_name]));
  }, [common, engine]);

  const errorMessage = useMemoizedFn((error: ParseSimcError): string => {
    switch (error.type) {
      case "cannotDetectSpec": {
        return content.cannotDetectSpec.value;
      }

      case "parseFailed": {
        return error.message ?? content.failedToParseProfile.value;
      }

      case "specNotSupported": {
        return content.specNotSupported({ id: error.specId }).value;
      }
    }
  });

  const saveCharacter = useMemoizedFn(
    async (rawSimc: string, profile: Profile, savedSpecId: number) => {
      try {
        const saved = await upsertSavedCharacter({
          profile,
          rawSimc,
          specId: savedSpecId,
        });
        const character = useCharacterStore.getState();

        if (!character.frozenCharacterId) {
          character.setActive(saved.id);
        }
      } catch (error) {
        log.withError(error).error("Failed to save character");
      }
    },
  );

  const doParse = useMemoizedFn((input: string) => {
    const simulator = useSimulatorStore.getState();

    if (!input.trim()) {
      setState({ parseError: null, profile: null });
      simulator.setSpecId(null);

      return;
    }

    const result = parseAndValidateSimc(
      common,
      new Set(implementedSpecNames.keys()),
      input,
    );

    if (!result.ok) {
      setState({
        parseError: errorMessage(result.error),
        profile: result.profile,
      });
      simulator.setSpecId(null);

      return;
    }

    setState({ parseError: null, profile: result.profile });

    if (result.specId !== simulator.specId) {
      simulator.setRotationId(null);
    }

    simulator.setSpecId(result.specId);
    void saveCharacter(input, result.profile, result.specId);
  });

  useMount(() => doParse(simcInput));
  useDebounceEffect(() => doParse(simcInput), [simcInput], { wait: 300 });

  const specName = specId
    ? (implementedSpecNames.get(specId) ??
      content.specNameFallback({ id: specId }).value)
    : null;

  return {
    parseError: state.parseError,
    profile: state.profile,
    setSimcInput,
    simcInput,
    specId,
    specName,
  };
}
