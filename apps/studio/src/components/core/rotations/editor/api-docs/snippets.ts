import { capitalCase } from "change-case";

import type { FieldDescriptorInfo } from "../types";
import type { ApiActionEntry, ApiOperatorEntry } from "./operator-catalog";

export function buildActionSnippet(action: ApiActionEntry): string {
  return JSON.stringify({ enabled: true, type: action.id }, null, 2);
}

export function buildFieldSnippet(d: FieldDescriptorInfo): string {
  return JSON.stringify(
    { domain: d.domain, name: d.name, type: "read" },
    null,
    2,
  );
}

export function buildOperatorSnippet(op: ApiOperatorEntry): string {
  let payload: unknown;

  switch (op.group) {
    case "arith": {
      payload = { left: null, op: op.id, right: null, type: "arith" };
      break;
    }

    case "compare": {
      payload = { left: null, op: op.id, right: null, type: "compare" };
      break;
    }

    case "logical": {
      payload =
        op.id === "not"
          ? { operand: null, type: "not" }
          : { operands: [], type: op.id };
      break;
    }

    case "min_max": {
      payload = { left: null, op: op.id, right: null, type: "min_max" };
      break;
    }

    case "unary_math": {
      payload = { op: op.id, operand: null, type: "unary_math" };
      break;
    }
  }

  return JSON.stringify(payload, null, 2);
}

export function formatDomainLabel(domain: string): string {
  return capitalCase(domain);
}
