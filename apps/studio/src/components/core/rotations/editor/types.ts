export type {
  Action,
  ArithOp,
  CompareOp,
  Condition,
  FieldDescriptorInfo,
  FieldRead,
  MinMaxOp,
  Rotation,
  TargetIf,
  TargetIfMode,
  UnaryMathOp,
  VarOp,
} from "wowlab-engine";

import type { Action, Condition, VarOp } from "wowlab-engine";

export type ActionEntry = {
  id: string;
  type: Action["type"];
  spell?: string;
  list?: string;
  name?: string;
  op?: VarOp;
  value?: Condition;
  seconds?: number;
  extra?: number;
  slot?: number;
  condition?: Condition;
  target_if?: { mode: "min" | "max" | "first"; expr: Condition };
  enabled?: boolean;
};

export type ConditionEditorCtx = {
  descriptors: import("wowlab-engine").FieldDescriptorInfo[];
  spellSlugs: string[];
  auraSlugs: string[];
  resourceNames: string[];
  depth: number;
};

// docref:start rotation-editor-action-types
export const ACTION_TYPES: { value: Action["type"]; label: string }[] = [
  { label: "Cast Spell", value: "cast" },
  { label: "Call List", value: "call" },
  { label: "Run List", value: "run" },
  { label: "Set Variable", value: "set_var" },
  { label: "Modify Variable", value: "modify_var" },
  { label: "Wait", value: "wait" },
  { label: "Wait Until", value: "wait_until" },
  { label: "Pool", value: "pool" },
  { label: "Use Trinket", value: "use_trinket" },
  { label: "Use Item", value: "use_item" },
];
// docref:end rotation-editor-action-types

export const COMPARE_OPS: {
  value: import("wowlab-engine").CompareOp;
  label: string;
}[] = [
  { label: ">", value: "gt" },
  { label: ">=", value: "gte" },
  { label: "<", value: "lt" },
  { label: "<=", value: "lte" },
  { label: "==", value: "eq" },
  { label: "!=", value: "ne" },
];

export const ARITH_OPS: {
  value: import("wowlab-engine").ArithOp;
  label: string;
}[] = [
  { label: "+", value: "add" },
  { label: "-", value: "sub" },
  { label: "*", value: "mul" },
  { label: "/", value: "div" },
  { label: "%", value: "mod" },
];

export const VAR_OPS: {
  value: import("wowlab-engine").VarOp;
  label: string;
}[] = [
  { label: "Add", value: "add" },
  { label: "Subtract", value: "sub" },
  { label: "Multiply", value: "mul" },
  { label: "Divide", value: "div" },
  { label: "Modulo", value: "mod" },
  { label: "Max", value: "max" },
  { label: "Min", value: "min" },
  { label: "Floor", value: "floor" },
  { label: "Ceil", value: "ceil" },
  { label: "Reset", value: "reset" },
];

export function addActionIds(actions: Action[]): ActionEntry[] {
  return actions.map((a) => ({ ...a, id: generateId() }) as ActionEntry);
}

export function conditionLabel(node: Condition): string {
  switch (node.type) {
    case "and": {
      return `AND (${node.operands.length})`;
    }

    case "arith": {
      return `Arith (${node.op})`;
    }

    case "bool": {
      return String(node.value);
    }

    case "compare": {
      return `Compare (${node.op})`;
    }

    case "float":
    case "int": {
      return String(node.value);
    }

    case "if_then_else": {
      return "if/then/else";
    }

    case "min_max": {
      return `${node.op}(...)`;
    }

    case "not": {
      return "NOT ...";
    }

    case "or": {
      return `OR (${node.operands.length})`;
    }

    case "read": {
      const keySuffix = node.key ? `[${node.key}]` : "";

      return `${node.domain}.${node.name}${keySuffix}`;
    }

    case "unary_math": {
      return `${node.op}(...)`;
    }

    case "var": {
      return `var(${node.name})`;
    }
  }
}

export function convertConditionType(
  newType: string,
  current: Condition,
): Condition {
  const def = createDefaultCondition();

  switch (newType) {
    case "and": {
      return { operands: [current], type: "and" };
    }

    case "arith": {
      return {
        left: current,
        op: "add",
        right: { type: "float", value: 0 },
        type: "arith",
      };
    }

    case "bool": {
      return { type: "bool", value: true };
    }

    case "compare": {
      return {
        left: current,
        op: "gt",
        right: { type: "float", value: 0 },
        type: "compare",
      };
    }

    case "float": {
      return { type: "float", value: 0 };
    }

    case "if_then_else": {
      return {
        condition: current,
        otherwise: def,
        then: def,
        type: "if_then_else",
      };
    }

    case "int": {
      return { type: "int", value: 0 };
    }

    case "min_max": {
      return {
        left: current,
        op: "min",
        right: { type: "float", value: 0 },
        type: "min_max",
      };
    }

    case "not": {
      return { operand: current, type: "not" };
    }

    case "or": {
      return { operands: [current], type: "or" };
    }

    case "read": {
      return { domain: "player", name: "haste", type: "read" };
    }

    case "unary_math": {
      return { op: "floor", operand: current, type: "unary_math" };
    }

    case "var": {
      return { name: "", type: "var" };
    }

    default: {
      return current;
    }
  }
}

export function createDefaultAction(): ActionEntry {
  return {
    condition: createDefaultCondition(),
    id: generateId(),
    spell: "",
    type: "cast",
  };
}

export function createDefaultCondition(): Condition {
  return { type: "bool", value: true };
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function stripActionIds(actions: ActionEntry[]): Action[] {
  return actions.map((entry) => {
    const copy: Partial<ActionEntry> = { ...entry };

    delete copy.id;

    return copy as Action;
  });
}
