"use client";

import { useIntlayer } from "next-intlayer";

import type {
  Condition,
  ConditionEditorCtx,
  MinMaxOp,
} from "@/components/core/rotations/editor/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { ConditionBuilder } from "../condition-builder";

type MinMaxNodeProps = {
  node: Extract<Condition, { type: "min_max" }>;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
  Builder: typeof ConditionBuilder;
};

export function MinMaxNode({
  Builder,
  ctx,
  node,
  onChange,
}: Readonly<MinMaxNodeProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="space-y-2">
      <Select
        value={node.op}
        onValueChange={(op) => onChange({ ...node, op: op as MinMaxOp })}
      >
        <SelectTrigger size="sm" className="h-7 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="min">{content.minMaxMin}</SelectItem>
          <SelectItem value="max">{content.minMaxMax}</SelectItem>
        </SelectContent>
      </Select>
      <Builder
        value={node.left}
        onChange={(left) => onChange({ ...node, left })}
        ctx={ctx}
      />
      <Builder
        value={node.right}
        onChange={(right) => onChange({ ...node, right })}
        ctx={ctx}
      />
    </div>
  );
}
