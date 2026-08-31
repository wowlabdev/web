"use client";

import type { Condition } from "@/components/core/rotations/editor/types";

import { Input } from "@wowlab/shared/components/ui/input";

type NumberNode = Extract<Condition, { type: "float" | "int" }>;

type NumberNodeProps = {
  node: NumberNode;
  onChange: (node: Condition) => void;
  parse: (raw: string) => number;
  step?: string;
};

export function NumberNode({
  node,
  onChange,
  parse,
  step,
}: Readonly<NumberNodeProps>) {
  return (
    <Input
      type="number"
      step={step}
      value={node.value}
      onChange={(e) => onChange({ ...node, value: parse(e.target.value) || 0 })}
      className="h-7 w-24 text-xs"
    />
  );
}
