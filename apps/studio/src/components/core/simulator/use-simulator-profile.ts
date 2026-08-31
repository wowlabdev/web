"use client";

import type { Profile } from "wowlab-common";

import {
  useBoolean,
  useCreation,
  useDebounceEffect,
  useMemoizedFn,
  useMount,
  useSetState,
} from "ahooks";
import { useIntlayer } from "next-intlayer";

import { useConfirm } from "@/components/shared/ui/confirm-dialog";
import { useCommon, useEngine } from "@/components/shared/wasm";
import { log } from "@/lib/observability";
import { clearAllJobs, createJob } from "@/lib/query/services";
import { buildProfileSimConfig } from "@/lib/sim/intent";
import {
  parseAndValidateSimc,
  type ParseSimcError,
} from "@/lib/sim/parse-simc";
import { useSimulatorStore } from "@/lib/state";
import { useCharacterStore } from "@/lib/state/character-store";
import { upsertSavedCharacter } from "@/lib/user-data";
import { buildSentinelConfig, parseImplementedSpecs } from "@/lib/wasm/api";
import { href, routes, useLocalizedRouter } from "@wowlab/shared/lib/routing";

import type { SettingValue } from "./settings/setting-types";

type SentinelInput = {
  iterations: number;
  max_chunks: number;
  priority: number;
};

type UseSimulatorProfileArgs = {
  overrides: Record<string, SettingValue>;
  rotationId: string | null;
  simcInput: string;
  specId: number | null;
};

export function useSimulatorProfile({
  overrides,
  rotationId,
  simcInput,
  specId,
}: UseSimulatorProfileArgs) {
  const content = useIntlayer("simulatorPage");
  const confirm = useConfirm();
  const router = useLocalizedRouter();
  const common = useCommon();
  const engine = useEngine();

  const [state, setState] = useSetState({
    parseError: null as string | null,
    profile: null as Profile | null,
    submitError: null as string | null,
  });

  const [isClearing, { setFalse: stopClearing, setTrue: startClearing }] =
    useBoolean(false);
  const [isSubmitting, { setFalse: stopSubmitting, setTrue: startSubmitting }] =
    useBoolean(false);

  const implementedSpecNames = useCreation(() => {
    const specs = parseImplementedSpecs(common, engine.getImplementedSpecs());

    return new Map(specs.map((spec) => [spec.spec_id, spec.display_name]));
  }, [common, engine]);

  const handleClearAll = useMemoizedFn(async () => {
    const confirmed = await confirm({
      confirmLabel: content.clearAllJobs,
      description: content.confirmDeleteAllJobs,
      isDestructive: true,
    });

    if (!confirmed) {
      return;
    }

    startClearing();

    try {
      await clearAllJobs();
      router.refresh();
    } catch (error) {
      setState({
        submitError:
          error instanceof Error
            ? error.message
            : content.failedToClearJobs.value,
      });
    } finally {
      stopClearing();
    }
  });

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

  useMount(() => {
    doParse(simcInput);
  });

  useDebounceEffect(
    () => {
      doParse(simcInput);
    },
    [simcInput],
    { wait: 300 },
  );

  const submitJob = useMemoizedFn(async (sentinelInput: SentinelInput) => {
    const profile = state.profile;

    if (!profile || !specId || !rotationId) {
      return;
    }

    startSubmitting();
    setState({ submitError: null });

    try {
      const simConfig = buildProfileSimConfig(common, {
        profile,
        rotationId,
        settings: overrides,
        specId,
      });

      const sentinelConfig = buildSentinelConfig(common, {
        iterations: sentinelInput.iterations,
        max_chunks: sentinelInput.max_chunks,
        priority: sentinelInput.priority,
        target_error: 0.05,
      });

      const result = await createJob({
        p_sentinel_config: sentinelConfig,
        p_sim_config: simConfig,
      });

      if (!result) {
        return;
      }

      router.push(href(routes.simulate.results, { id: result.jobId }));
    } catch (error) {
      setState({
        submitError:
          error instanceof Error
            ? error.message
            : content.failedToSubmitJob.value,
      });
    } finally {
      stopSubmitting();
    }
  });

  return {
    handleClearAll,
    implementedSpecNames,
    isClearing,
    isSubmitting,
    parseError: state.parseError,
    profile: state.profile,
    submitError: state.submitError,
    submitJob,
  };
}
