"use client";

import {
  ARITH_OPS,
  type ArithOp,
  type Condition,
  type ConditionEditorCtx,
} from "@/components/core/rotations/editor/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { ConditionBuilder } from "../condition-builder";

type ArithNodeProps = {
  node: Extract<Condition, { type: "arith" }>;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
  Builder: typeof ConditionBuilder;
};

export function ArithNode({
  Builder,
  ctx,
  node,
  onChange,
}: Readonly<ArithNodeProps>) {
  return (
    <div className="space-y-2">
      <Builder
        value={node.left}
        onChange={(left) => onChange({ ...node, left })}
        ctx={ctx}
      />
      <Select
        value={node.op}
        onValueChange={(op) => onChange({ ...node, op: op as ArithOp })}
      >
        <SelectTrigger size="sm" className="h-7 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ARITH_OPS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Builder
        value={node.right}
        onChange={(right) => onChange({ ...node, right })}
        ctx={ctx}
      />
    </div>
  );
}
