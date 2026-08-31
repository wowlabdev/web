"use client";

import type { SpecIntrospection } from "wowlab-common";

import type { AiGrammar } from "@wowlab/shared/lib/ai-contract";

import { useCommon, useEngine } from "@/components/shared/wasm";

import type { Rotation } from "../types";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import { buildDiagnosticsMarkdown } from "../preview/build-diagnostics";
import { usePreviewQuery } from "../preview/use-preview-query";
import { useEditorContext } from "../use-editor-context";

export type AssistantContext = {
  grammar: AiGrammar;
  specId: number;
  dehydrate: () => Rotation;
  buildContextMarkdown: () => string;
};

export function useAssistantContext(specId: number): AssistantContext {
  const { auraSlugs, descriptors, resourceNames, spellSlugs } =
    useEditorContext(specId);
  const engine = useEngine();

  const common = useCommon();
  const script = useEditorDocument((s) => s.script);
  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const trace = useEditorUi((s) => s.trace);
  const validation = useEditorUi((s) => s.validation);
  const { query } = usePreviewQuery();

  const grammar: AiGrammar = {
    auraSlugs,
    descriptors,
    resourceNames,
    spellSlugs,
  };

  const buildContextMarkdown = (): string => {
    let intro: SpecIntrospection | null;

    try {
      intro = engine.getSpecIntrospection(specId);
    } catch {
      intro = null;
    }

    return buildDiagnosticsMarkdown({
      common,
      controls: {
        archetype: query.archetype,
        durationS: query.duration,
        seed: query.seed,
        targetCount: query.targets,
      },
      error: null,
      intro,
      runState: trace ? "ok" : "idle",
      script,
      simConfig: null,
      specId,
      trace,
      validation,
    });
  };

  return { buildContextMarkdown, dehydrate, grammar, specId };
}
