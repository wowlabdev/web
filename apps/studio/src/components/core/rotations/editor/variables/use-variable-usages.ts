"use client";

import { useMemo } from "react";

import type { ActionEntry, Condition } from "../types";

import { useEditorDocument } from "../editor-store-provider";
import { visitCondition } from "../lib/visit-condition";

export type ActionRef = {
  listId: string;
  actionIndex: number;
  location: "condition" | "modify_var" | "set_var";
};

export type VariableUsage = {
  readBy: ActionRef[];
  setBy: ActionRef[];
  inferredType: "bool" | "expression" | "float" | "int" | "unknown";
};

export type VariableUsagesIndex = Record<string, VariableUsage>;

export function useVariableUsages(): VariableUsagesIndex {
  const variables = useEditorDocument((s) => s.script.variables);
  const lists = useEditorDocument((s) => s.script.lists);

  return useMemo(() => {
    const index: VariableUsagesIndex = {};

    for (const [name, expression] of Object.entries(variables)) {
      touch(index, name).inferredType = inferType(expression);
    }

    for (const [listId, entries] of Object.entries(lists)) {
      for (const [actionIndex, entry] of entries.entries()) {
        indexEntry(index, entry, listId, actionIndex);
      }
    }

    return index;
  }, [variables, lists]);
}

function collectReads(node: Condition, sink: (name: string) => void) {
  visitCondition(node, {
    onVar: (n) => {
      sink(n.name);
    },
  });
}

function indexEntry(
  index: VariableUsagesIndex,
  entry: ActionEntry,
  listId: string,
  actionIndex: number,
): void {
  if (entry.type === "set_var" && entry.name) {
    const usage = touch(index, entry.name);

    usage.setBy.push({ actionIndex, listId, location: "set_var" });

    if (entry.value && usage.inferredType === "unknown") {
      usage.inferredType = inferType(entry.value);
    }
  }

  if (entry.type === "modify_var" && entry.name) {
    touch(index, entry.name).setBy.push({
      actionIndex,
      listId,
      location: "modify_var",
    });
  }

  if (entry.condition) {
    collectReads(entry.condition, (name) => {
      touch(index, name).readBy.push({
        actionIndex,
        listId,
        location: "condition",
      });
    });
  }

  if (entry.value) {
    const location = entry.type === "set_var" ? "set_var" : "modify_var";

    collectReads(entry.value, (name) => {
      touch(index, name).readBy.push({ actionIndex, listId, location });
    });
  }
}

function inferType(node: Condition): VariableUsage["inferredType"] {
  switch (node.type) {
    case "bool": {
      return "bool";
    }

    case "compare": {
      return "bool";
    }

    case "float": {
      return "float";
    }

    case "int": {
      return "int";
    }

    default: {
      return "expression";
    }
  }
}

function touch(index: VariableUsagesIndex, name: string): VariableUsage {
  const existing = index[name] as VariableUsage | undefined;

  if (existing) {
    return existing;
  }

  const created: VariableUsage = {
    inferredType: "unknown",
    readBy: [],
    setBy: [],
  };

  index[name] = created;

  return created;
}
