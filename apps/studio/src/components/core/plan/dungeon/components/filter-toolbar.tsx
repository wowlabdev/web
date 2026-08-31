"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

export type FilterDescriptor = {
  id: string;
  label: string;
  isActive: boolean;
  onToggle: () => void;
  activeLabel?: string;
};

type FilterToolbarProps = {
  filters: ReadonlyArray<FilterDescriptor>;
};

export function FilterToolbar({ filters }: Readonly<FilterToolbarProps>) {
  const selected = filters.filter((f) => f.isActive).map((f) => f.id);

  return (
    <ToggleGroup
      type="multiple"
      value={selected}
      onValueChange={(next) => {
        for (const f of filters) {
          const shouldBeActive = next.includes(f.id);

          if (shouldBeActive !== f.isActive) {
            f.onToggle();
          }
        }
      }}
      variant="outline"
    >
      {filters.map((f) => (
        <ToggleGroupItem key={f.id} value={f.id}>
          {f.isActive && f.activeLabel ? f.activeLabel : f.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
