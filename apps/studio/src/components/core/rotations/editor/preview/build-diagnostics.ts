import type { SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import type { EditorScript } from "../store-types";
import type { RotationValidationState } from "../validation/types";
import type { PreviewControls } from "./use-live-trace";

import {
  appendResolvedSpells,
  renderValidationError,
  renderValidationWarning,
} from "./build-diagnostics-render";
import { appendTraceSummary } from "./build-diagnostics-trace";

export type DiagnosticsInput = {
  common: typeof import("wowlab-common");
  controls: PreviewControls;
  error: string | null;
  intro: SpecIntrospection | null;
  runState: "error" | "idle" | "ok" | "pending";
  script: EditorScript;
  simConfig: string | null;
  specId: number | null;
  trace: IterationTrace | null;
  validation: RotationValidationState;
};

export function buildDiagnosticsMarkdown(input: DiagnosticsInput): string {
  const {
    common,
    controls,
    error,
    intro,
    runState,
    script,
    simConfig,
    specId,
    trace,
    validation,
  } = input;
  const doc = new common.MarkdownDoc();

  doc.h1("Rotation preview diagnostics");
  doc.blank();
  doc.kvBullet("specId", specId == null ? "null" : String(specId));
  doc.kvBullet("runState", runState);
  doc.kvBullet("validationStatus", validation.status);
  doc.kvBullet(
    "controls",
    `duration=${controls.durationS}s, seed=${controls.seed}, targets=${controls.targetCount}, archetype=${controls.archetype}`,
  );

  if (simConfig) {
    doc.blank();
    doc.h2("Sim config");
    doc.codeBlock("toml", simConfig);
  }

  if (error) {
    doc.blank();
    doc.h2("Error");
    doc.codeBlock("", error);
  }

  if (validation.errors.length > 0) {
    doc.blank();
    doc.h2(`Validation errors (${validation.errors.length})`);

    for (const err of validation.errors) {
      doc.bullet(renderValidationError(err));
    }
  }

  if (validation.warnings.length > 0) {
    doc.blank();
    doc.h2(`Validation warnings (${validation.warnings.length})`);

    for (const w of validation.warnings) {
      doc.bullet(renderValidationWarning(w));
    }
  }

  if (trace) {
    appendTraceSummary(doc, trace);
  }

  appendResolvedSpells(doc, script, intro);

  doc.blank();
  doc.h2("Rotation JSON");
  doc.codeBlock("json", JSON.stringify(script, null, 2));

  return doc.build();
}
