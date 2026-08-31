"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useId, useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";

import type { ConditionBuilder } from "./condition-builder";

import {
  type Condition,
  type ConditionEditorCtx,
  createDefaultCondition,
} from "../types";

type OperandListProps = {
  operands: Condition[];
  onChange: (operands: Condition[]) => void;
  ctx: ConditionEditorCtx;
  Builder: typeof ConditionBuilder;
};

export function OperandList({
  Builder,
  ctx,
  onChange,
  operands,
}: Readonly<OperandListProps>) {
  const content = useIntlayer("rotationEditor");
  const listId = useId();
  const [listState, setListState] = useState(() => ({
    ids: operands.map((_, index) => `${listId}-${index}`),
    nextId: operands.length,
    operands,
  }));

  let currentState = listState;

  if (listState.operands !== operands) {
    const nextId = listState.nextId + operands.length;

    currentState = {
      ids: operands.map((_, index) => `${listId}-${listState.nextId + index}`),
      nextId,
      operands,
    };
    setListState(currentState);
  }

  const commit = (nextOperands: Condition[], ids: string[], nextId: number) => {
    setListState({ ids, nextId, operands: nextOperands });
    onChange(nextOperands);
  };

  return (
    <div className="space-y-2">
      {operands.map((op, idx) => (
        <div key={currentState.ids[idx]} className="flex gap-1">
          <div className="min-w-0 flex-1">
            <Builder
              value={op}
              onChange={(updated) => {
                const next = [...operands];

                next[idx] = updated;
                commit(next, currentState.ids, currentState.nextId);
              }}
              ctx={ctx}
            />
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="mt-0.5 size-6 shrink-0"
            onClick={() => {
              commit(
                operands.filter((_, index) => index !== idx),
                currentState.ids.filter((_, index) => index !== idx),
                currentState.nextId,
              );
            }}
          >
            <TrashIcon className="size-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={() => {
          commit(
            [...operands, createDefaultCondition()],
            [...currentState.ids, `${listId}-${currentState.nextId}`],
            currentState.nextId + 1,
          );
        }}
      >
        <PlusIcon className="size-3" />
        {content.operandAddButton}
      </Button>
    </div>
  );
}
