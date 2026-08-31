"use client";

import { useIntlayer } from "next-intlayer";

import { GitHubIcon } from "@wowlab/shared/lib/icons";
import { makeAssistantPromptsUrl } from "@wowlab/shared/lib/links";

import type { PromptAction } from "./prompt-registry";

import { PresetChip } from "./preset-chip";

export type ComposerMode = "chat" | "rotation" | "list" | "simc";

const MODE_CHIPS = [
  { key: "capabilityGenerateRotation", mode: "rotation" },
  { key: "capabilityGenerateList", mode: "list" },
  { key: "capabilityImportSimc", mode: "simc" },
] as const;

const PROMPT_CHIPS = [
  { label: "Fix errors", onlyOnErrors: true, type: "fix" },
  { label: "Explain", type: "explain" },
  { label: "Critique", type: "critique" },
  { label: "Audit spells", type: "audit" },
] as const;

type AssistantPresetsProps = {
  mode: ComposerMode;
  hasErrors: boolean;
  onSelectMode: (mode: ComposerMode) => void;
  onPremadePrompt: (action: PromptAction) => void;
};

export function AssistantPresets({
  hasErrors,
  mode,
  onPremadePrompt,
  onSelectMode,
}: Readonly<AssistantPresetsProps>) {
  const content = useIntlayer("rotationAssistant");

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b p-3">
      {MODE_CHIPS.map(({ key, mode: chipMode }) => (
        <PresetChip
          key={chipMode}
          active={mode === chipMode}
          onClick={() => onSelectMode(chipMode)}
        >
          {content[key]}
        </PresetChip>
      ))}
      {PROMPT_CHIPS.map(({ label, type, ...rest }) =>
        "onlyOnErrors" in rest && !hasErrors ? null : (
          <PresetChip key={type} onClick={() => onPremadePrompt(type)}>
            {label}
          </PresetChip>
        ),
      )}
      <a
        className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1.5 text-xs transition-colors"
        href={makeAssistantPromptsUrl()}
        rel="noreferrer"
        target="_blank"
      >
        <GitHubIcon className="size-3.5" />
        View prompts
      </a>
    </div>
  );
}
