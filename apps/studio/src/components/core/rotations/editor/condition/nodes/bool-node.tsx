"use client";

import { useIntlayer } from "next-intlayer";

import type { Condition } from "@/components/core/rotations/editor/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type BoolNodeProps = {
  node: Extract<Condition, { type: "bool" }>;
  onChange: (node: Condition) => void;
};

export function BoolNode({ node, onChange }: Readonly<BoolNodeProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <Select
      value={String(node.value)}
      onValueChange={(v) => onChange({ ...node, value: v === "true" })}
    >
      <SelectTrigger size="sm" className="h-7 w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">{content.literalTrue}</SelectItem>
        <SelectItem value="false">{content.literalFalse}</SelectItem>
      </SelectContent>
    </Select>
  );
}
