"use client";

import type { DungeonManifestEntry } from "@/lib/zod";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

type FloorTabsProps = {
  dungeon: DungeonManifestEntry;
  floor: number;
  onChange: (index: number) => void;
};

export function FloorTabs({
  dungeon,
  floor,
  onChange,
}: Readonly<FloorTabsProps>) {
  const floors = dungeon.floors.filter((f) => f.zoomLevels.length > 0);

  if (floors.length <= 1) {
    return null;
  }

  return (
    <ToggleGroup
      type="single"
      value={String(floor)}
      onValueChange={(v) => {
        if (v) {
          onChange(Number(v));
        }
      }}
      variant="outline"
    >
      {floors.map((f) => (
        <ToggleGroupItem key={f.index} value={String(f.index)} title={f.name}>
          F{f.index}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
