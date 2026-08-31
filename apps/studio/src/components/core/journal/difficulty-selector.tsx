"use client";

import { useDifficultyLabels } from "@/components/shared/game";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

import type { DifficultyScope } from "./types";

import { difficultyScopes } from "./types";

type DifficultySelectorProps = {
  allowed?: DifficultyScope[];
  onChange: (scope: DifficultyScope) => void;
  value: DifficultyScope;
};

export function DifficultySelector({
  allowed,
  onChange,
  value,
}: Readonly<DifficultySelectorProps>) {
  const labels = useDifficultyLabels();
  const options = allowed
    ? difficultyScopes.filter((scope) => allowed.includes(scope))
    : difficultyScopes;

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) {
          onChange(next as DifficultyScope);
        }
      }}
      variant="outline"
      size="sm"
    >
      {options.map((scope) => (
        <ToggleGroupItem key={scope} value={scope}>
          {labels[scope]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
