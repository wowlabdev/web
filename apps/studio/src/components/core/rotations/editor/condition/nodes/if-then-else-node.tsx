"use client";

import { useIntlayer } from "next-intlayer";

import type {
  Condition,
  ConditionEditorCtx,
} from "@/components/core/rotations/editor/types";

import type { ConditionBuilder } from "../condition-builder";

type IfThenElseNodeProps = {
  node: Extract<Condition, { type: "if_then_else" }>;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
  Builder: typeof ConditionBuilder;
};

export function IfThenElseNode({
  Builder,
  ctx,
  node,
  onChange,
}: Readonly<IfThenElseNodeProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground">{content.ifLabel}</span>
      <Builder
        value={node.condition}
        onChange={(condition) => onChange({ ...node, condition })}
        ctx={ctx}
      />
      <span className="text-xs text-muted-foreground">{content.thenLabel}</span>
      <Builder
        value={node.then}
        onChange={(then) => onChange({ ...node, then })}
        ctx={ctx}
      />
      <span className="text-xs text-muted-foreground">{content.elseLabel}</span>
      <Builder
        value={node.otherwise}
        onChange={(otherwise) => onChange({ ...node, otherwise })}
        ctx={ctx}
      />
    </div>
  );
}
