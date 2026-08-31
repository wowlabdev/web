import type { AiGrammar, AiObjectKind } from "@wowlab/shared/lib/ai-contract";

import { Eta } from "eta";

// Engine validation errors are opaque here — they're rendered back to the model verbatim.
type ValidationError = Record<string, unknown>;

// Prompt .eta files are static_files (see supabase/config.toml), read once at init into Eta's store so requests never touch the filesystem.
const eta = new Eta({ autoEscape: false, autoTrim: false });

const TEMPLATES = [
  "object-system",
  "chat-system",
  "_target",
  "_grammar",
  "_rules",
  "_context",
  "_errors",
  "_tools",
  "_entities",
];

await Promise.all(
  TEMPLATES.map(async (name) => {
    const src = await Deno.readTextFile(
      new URL(`prompts/${name}.eta`, import.meta.url),
    );

    eta.loadTemplate(`@${name}`, src);
  }),
);

export function buildChatSystemPrompt(input: {
  contextMarkdown: string;
  toolsAvailable: boolean;
}): string {
  return eta
    .render("@chat-system", {
      contextMarkdown: input.contextMarkdown.trim(),
      toolsAvailable: input.toolsAvailable,
    })
    .trim();
}

export function buildObjectSystemPrompt(input: {
  kind: AiObjectKind;
  grammar: AiGrammar;
  contextMarkdown: string;
  priorCandidate?: unknown;
  priorErrors?: ValidationError[];
}): string {
  const hasErrors = (input.priorErrors?.length ?? 0) > 0;

  return eta
    .render("@object-system", {
      contextMarkdown: input.contextMarkdown.trim(),
      grammar: input.grammar,
      kind: input.kind,
      priorCandidateJson: hasErrors
        ? JSON.stringify(input.priorCandidate ?? null, null, 2)
        : "",
      priorErrorsJson: hasErrors
        ? JSON.stringify(input.priorErrors, null, 2)
        : "",
    })
    .trim();
}
