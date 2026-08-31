"use client";

import type { IterationTrace } from "wowlab-engine";

import { useDebounceFn, useMemoizedFn, useSetState } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useEffect, useRef } from "react";

import type { ResolveEvent } from "@/lib/node/worker-contract";

import { useSpecPaperdollProfile } from "@/components/shared/character/use-spec-paperdoll-profile";
import { useCommon } from "@/components/shared/wasm";
import { runTraceOnWorker } from "@/lib/node/resolution-worker-client";
import { buildProfileSimConfig } from "@/lib/sim/intent";
import {
  beginResolveActivity,
  endResolveActivity,
  reportResolveEvent,
} from "@/lib/state/resolve-activity-store";

import type { PreviewFightStyle } from "./constants";

import { useEditorDocument } from "../editor-store-provider";

export type LiveTraceState = "error" | "idle" | "ok" | "pending";

export type PreviewControls = {
  archetype: PreviewFightStyle;
  durationS: number;
  seed: number;
  targetCount: number;
};

export type UseLiveTraceResult = {
  completedAt: null | number;
  error: null | string;
  retry: () => void;
  runState: LiveTraceState;
  simConfig: null | string;
  trace: IterationTrace | null;
};

const DEBOUNCE_MS = 250;

type TraceState = {
  completedAt: null | number;
  error: null | string;
  retryNonce: number;
  runState: LiveTraceState;
  simConfig: null | string;
  trace: IterationTrace | null;
};

export function useLiveTrace(controls: PreviewControls): UseLiveTraceResult {
  const content = useIntlayer("rotationEditor");
  const script = useEditorDocument((s) => s.script);
  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const specId = useEditorDocument((s) => s.metadata.specId);

  const common = useCommon();
  const { profile } = useSpecPaperdollProfile(specId);

  const [state, setState] = useSetState<TraceState>({
    completedAt: null,
    error: null,
    retryNonce: 0,
    runState: "idle",
    simConfig: null,
    trace: null,
  });

  const tokenRef = useRef(0);

  const runTrace = useMemoizedFn(async () => {
    if (specId == null || !profile) {
      return;
    }

    const myToken = ++tokenRef.current;

    setState({ error: null, runState: "pending", simConfig: null });
    beginResolveActivity();

    try {
      const simConfig = buildProfileSimConfig(common, {
        durationS: controls.durationS,
        enemyCount: previewEnemyCount(controls.archetype, controls.targetCount),
        profile,
        rotationId: "",
        specId,
      });
      const rotationJson = JSON.stringify(dehydrate());
      const seed = BigInt(controls.seed);

      setState({ simConfig });

      const next = await runTraceOnWorker(
        simConfig,
        rotationJson,
        seed,
        (event: ResolveEvent) => {
          if (myToken === tokenRef.current) {
            reportResolveEvent(event);
          }
        },
      );

      if (myToken !== tokenRef.current) {
        return;
      }

      setState({
        completedAt: Date.now(),
        runState: "ok",
        simConfig,
        trace: next,
      });
    } catch (error) {
      if (myToken !== tokenRef.current) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : content.previewTraceFailed.value;

      setState({ error: message, runState: "error" });
    } finally {
      endResolveActivity();
    }
  });

  const { cancel, run: debouncedRun } = useDebounceFn(runTrace, {
    wait: DEBOUNCE_MS,
  });

  useEffect(() => {
    if (specId == null || !profile) {
      return;
    }

    debouncedRun();

    return () => {
      cancel();
    };
  }, [
    cancel,
    debouncedRun,
    script,
    specId,
    profile,
    controls.archetype,
    controls.durationS,
    controls.seed,
    controls.targetCount,
    state.retryNonce,
  ]);

  const retry = useMemoizedFn(() =>
    setState({ retryNonce: state.retryNonce + 1 }),
  );

  if (specId == null || !profile) {
    return {
      completedAt: null,
      error: null,
      retry,
      runState: "idle",
      simConfig: null,
      trace: null,
    };
  }

  return {
    completedAt: state.completedAt,
    error: state.error,
    retry,
    runState: state.runState,
    simConfig: state.simConfig,
    trace: state.trace,
  };
}

function previewEnemyCount(
  archetype: PreviewFightStyle,
  configuredCount: number,
): number {
  switch (archetype) {
    case "FixedMulti2": {
      return 2;
    }

    case "FixedMulti5": {
      return 5;
    }

    case "Patchwerk": {
      return configuredCount;
    }

    case "Single": {
      return 1;
    }
  }
}
