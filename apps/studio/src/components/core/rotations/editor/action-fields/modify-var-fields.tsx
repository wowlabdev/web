"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import { type ActionEntry, VAR_OPS, type VarOp } from "../types";

type ModifyVarFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
};

export function ModifyVarFields({
  draft,
  onChange,
}: Readonly<ModifyVarFieldsProps>) {
  const content = useIntlayer("rotationEditor");
  const opLabels = useVarOpLabels();

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">{content.fieldVariableNameLabel}</Label>
        <Input
          value={draft.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={content.fieldVariableNamePlaceholder.value}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{content.fieldOperationLabel}</Label>
        <Select
          value={draft.op ?? "add"}
          onValueChange={(op) => onChange({ op: op as VarOp })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VAR_OPS.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {opLabels[op.value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function useVarOpLabels(): Record<VarOp, string> {
  const content = useIntlayer("rotationEditor");

  return useMemo(
    () => ({
      add: content.varOpAdd.value,
      ceil: content.varOpCeil.value,
      div: content.varOpDiv.value,
      floor: content.varOpFloor.value,
      max: content.varOpMax.value,
      min: content.varOpMin.value,
      mod: content.varOpMod.value,
      mul: content.varOpMul.value,
      reset: content.varOpReset.value,
      sub: content.varOpSub.value,
    }),
    [content],
  );
}
