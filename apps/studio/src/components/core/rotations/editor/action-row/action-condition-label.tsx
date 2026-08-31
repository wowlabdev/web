"use client";

import { useIntlayer } from "next-intlayer";

import { type Condition, conditionLabel } from "../types";

type ActionConditionLabelProps = {
  condition: Condition | undefined;
};

export function ActionConditionLabel({
  condition,
}: Readonly<ActionConditionLabelProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
      {condition ? conditionLabel(condition) : content.actionSummaryAlways}
    </span>
  );
}
