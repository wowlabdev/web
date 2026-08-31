import { Eta } from "eta/core";

import auditTemplate from "./prompts/audit.eta";
import critiqueTemplate from "./prompts/critique.eta";
import explainTemplate from "./prompts/explain.eta";
import fixTemplate from "./prompts/fix.eta";

const eta = new Eta({ autoEscape: false, autoTrim: false });
const registry = new Map<string, string>();

function registerPrompt(name: string, template: string): void {
  registry.set(name, template);
}

registerPrompt("fix", fixTemplate);
registerPrompt("explain", explainTemplate);
registerPrompt("critique", critiqueTemplate);
registerPrompt("audit", auditTemplate);

export type PromptAction = "fix" | "explain" | "critique" | "audit";

export function renderPrompt(
  action: PromptAction,
  data: Record<string, unknown> = {},
): string {
  const template = registry.get(action);

  if (!template) {
    throw new Error(`Unknown prompt action: ${action}`);
  }

  return eta.renderString(template, data).trim();
}
