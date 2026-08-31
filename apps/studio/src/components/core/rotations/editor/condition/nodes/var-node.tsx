"use client";

import { useIntlayer } from "next-intlayer";

import type { Condition } from "@/components/core/rotations/editor/types";

import { Input } from "@wowlab/shared/components/ui/input";

type VarNodeProps = {
  node: Extract<Condition, { type: "var" }>;
  onChange: (node: Condition) => void;
};

export function VarNode({ node, onChange }: Readonly<VarNodeProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <Input
      value={node.name}
      onChange={(e) => onChange({ ...node, name: e.target.value })}
      placeholder={content.varNodePlaceholder.value}
      className="h-7 w-40 text-xs"
    />
  );
}
