"use client";

import type { ValidationError } from "wowlab-engine";

import type { AiGrammar, AiObjectKind } from "@wowlab/shared/lib/ai-contract";

import { useEngine } from "@/components/shared/wasm";
import { aiFetch } from "@/lib/ai/client";

import type { Action, Condition, Rotation } from "../types";

import {
  tryParseActionList,
  tryParseCondition,
  tryParseRotation,
} from "../../rotation-schema";

export type AiObjectOutcome =
  | { status: "not_configured" }
  | { status: "error" }
  | { status: "invalid"; errors: ValidationError[] }
  | ({ status: "ready" } & AiObjectReady);

export type AiObjectReady =
  | { kind: "rotation"; object: Rotation }
  | { kind: "list"; object: Action[]; targetList?: string }
  | { kind: "condition"; object: Condition };

type CandidateResponse =
  { status: "error" | "not_configured" } | { status: "ready"; object: unknown };

type GenerateInput = {
  kind: AiObjectKind;
  grammar: AiGrammar;
  contextMarkdown: string;
  request: string;
  baseRotation: Rotation;
  specId: number;
  targetList?: string;
};

const MAX_ATTEMPTS = 3;
const PROBE_LIST = "__ai_probe__";

export function useAiObject() {
  const engine = useEngine();

  const generate = async (input: GenerateInput): Promise<AiObjectOutcome> => {
    let priorCandidate: unknown;
    let priorErrors: ValidationError[] | undefined;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = await fetchCandidate(
        input,
        priorCandidate,
        priorErrors,
      );

      if (candidate.status !== "ready") {
        return candidate;
      }

      const ready = toReady(input.kind, candidate.object, input.targetList);

      if (!ready) {
        return { status: "error" };
      }

      let result;

      try {
        result = engine.validateRotationForSpec(
          JSON.stringify(buildProbeRotation(ready, input.baseRotation)),
          input.specId,
        );
      } catch {
        // Engine couldn't parse the candidate at all: hard error, don't burn a retry.
        return { status: "error" };
      }

      if (result.valid || result.errors.length === 0) {
        return { status: "ready", ...ready };
      }

      priorCandidate = candidate.object;
      priorErrors = result.errors;
    }

    return { errors: priorErrors ?? [], status: "invalid" };
  };

  return { generate };
}

function buildProbeRotation(ready: AiObjectReady, base: Rotation): Rotation {
  if (ready.kind === "rotation") {
    return ready.object;
  }

  if (ready.kind === "list") {
    return {
      ...base,
      lists: { ...base.lists, [ready.targetList ?? "main"]: ready.object },
    };
  }

  return {
    ...base,
    lists: {
      ...base.lists,
      [PROBE_LIST]: [{ condition: ready.object, type: "wait_until" }],
    },
  };
}

async function fetchCandidate(
  input: GenerateInput,
  priorCandidate: unknown,
  priorErrors: ValidationError[] | undefined,
): Promise<CandidateResponse> {
  let response: Response;

  try {
    response = await aiFetch("object", {
      contextMarkdown: input.contextMarkdown,
      grammar: input.grammar,
      kind: input.kind,
      priorCandidate,
      priorErrors,
      request: input.request,
    });
  } catch {
    return { status: "error" };
  }

  if (response.status === 409) {
    return { status: "not_configured" };
  }

  if (!response.ok) {
    return { status: "error" };
  }

  try {
    const body: unknown = await response.json();

    return body != null && typeof body === "object" && "object" in body
      ? { object: body.object, status: "ready" }
      : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

function toReady(
  kind: AiObjectKind,
  object: unknown,
  targetList: string | undefined,
): AiObjectReady | null {
  if (kind === "list") {
    const actions = tryParseActionList(object);

    return actions ? { kind, object: actions, targetList } : null;
  }

  if (kind === "rotation") {
    const rotation = tryParseRotation(object);

    return rotation ? { kind, object: rotation } : null;
  }

  const condition = tryParseCondition(object);

  return condition ? { kind, object: condition } : null;
}
