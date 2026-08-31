"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type ConditionTypeSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

type TypeEntry = {
  group: "Logic" | "Value";
  label: string;
  value: TypeValue;
};

type TypeValue =
  | "and"
  | "arith"
  | "bool"
  | "compare"
  | "float"
  | "if_then_else"
  | "int"
  | "min_max"
  | "not"
  | "or"
  | "read"
  | "unary_math"
  | "var";

export function ConditionTypeSelect({
  onChange,
  value,
}: Readonly<ConditionTypeSelectProps>) {
  const content = useIntlayer("rotationEditor");

  const types = useMemo<TypeEntry[]>(
    () => [
      { group: "Logic", label: content.conditionTypeAnd.value, value: "and" },
      { group: "Logic", label: content.conditionTypeOr.value, value: "or" },
      { group: "Logic", label: content.conditionTypeNot.value, value: "not" },
      {
        group: "Logic",
        label: content.conditionTypeCompare.value,
        value: "compare",
      },
      {
        group: "Logic",
        label: content.conditionTypeIfThenElse.value,
        value: "if_then_else",
      },
      {
        group: "Value",
        label: content.conditionTypeFieldRead.value,
        value: "read",
      },
      {
        group: "Value",
        label: content.conditionTypeBoolean.value,
        value: "bool",
      },
      {
        group: "Value",
        label: content.conditionTypeInteger.value,
        value: "int",
      },
      {
        group: "Value",
        label: content.conditionTypeFloat.value,
        value: "float",
      },
      {
        group: "Value",
        label: content.conditionTypeVariable.value,
        value: "var",
      },
      {
        group: "Value",
        label: content.conditionTypeArithmetic.value,
        value: "arith",
      },
      {
        group: "Value",
        label: content.conditionTypeMinMax.value,
        value: "min_max",
      },
      {
        group: "Value",
        label: content.conditionTypeMath.value,
        value: "unary_math",
      },
    ],
    [content],
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="h-7 w-32 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{content.conditionGroupLogic}</SelectLabel>
          {types
            .filter((t) => t.group === "Logic")
            .map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>{content.conditionGroupValue}</SelectLabel>
          {types
            .filter((t) => t.group === "Value")
            .map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
