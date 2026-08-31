"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { WASM_COMMON_KEY, WASM_ENGINE_KEY } from "@/lib/query/services/game";
import { getCommon } from "@/lib/wasm/loaders/common";
import { getEngine } from "@/lib/wasm/loaders/engine";

type CommonModule = typeof import("wowlab-common");
type EngineModule = typeof import("wowlab-engine");

export function useCommon(): CommonModule {
  return useSuspenseQuery({ queryFn: getCommon, queryKey: WASM_COMMON_KEY })
    .data;
}

export function useEngine(): EngineModule {
  return useSuspenseQuery({ queryFn: getEngine, queryKey: WASM_ENGINE_KEY })
    .data;
}
