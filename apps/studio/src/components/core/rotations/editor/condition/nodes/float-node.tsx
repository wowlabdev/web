"use client";

import type { Condition } from "@/components/core/rotations/editor/types";

import { NumberNode } from "./number-node";

type FloatNodeProps = {
  node: Extract<Condition, { type: "float" }>;
  onChange: (node: Condition) => void;
};

export function FloatNode({ node, onChange }: Readonly<FloatNodeProps>) {
  return (
    <NumberNode
      node={node}
      onChange={onChange}
      parse={Number.parseFloat}
      step="0.1"
    />
  );
}
