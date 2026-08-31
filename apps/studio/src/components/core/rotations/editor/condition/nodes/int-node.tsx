"use client";

import type { Condition } from "@/components/core/rotations/editor/types";

import { NumberNode } from "./number-node";

type IntNodeProps = {
  node: Extract<Condition, { type: "int" }>;
  onChange: (node: Condition) => void;
};

export function IntNode({ node, onChange }: Readonly<IntNodeProps>) {
  return <NumberNode node={node} onChange={onChange} parse={Number.parseInt} />;
}
