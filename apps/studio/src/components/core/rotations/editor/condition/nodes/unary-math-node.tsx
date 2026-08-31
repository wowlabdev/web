"use client";

import { useIntlayer } from "next-intlayer";

import type {
  Condition,
  ConditionEditorCtx,
  UnaryMathOp,
} from "@/components/core/rotations/editor/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { ConditionBuilder } from "../condition-builder";

type UnaryMathNodeProps = {
  node: Extract<Condition, { type: "unary_math" }>;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
  Builder: typeof ConditionBuilder;
};

export function UnaryMathNode({
  Builder,
  ctx,
  node,
  onChange,
}: Readonly<UnaryMathNodeProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-2">
      <Select
        value={node.op}
        onValueChange={(op) => onChange({ ...node, op: op as UnaryMathOp })}
      >
        <SelectTrigger size="sm" className="h-7 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="floor">{content.unaryMathFloor}</SelectItem>
          <SelectItem value="ceil">{content.unaryMathCeil}</SelectItem>
          <SelectItem value="abs">{content.unaryMathAbs}</SelectItem>
        </SelectContent>
      </Select>
      <Builder
        value={node.operand}
        onChange={(operand) => onChange({ ...node, operand })}
        ctx={ctx}
      />
    </div>
  );
}
