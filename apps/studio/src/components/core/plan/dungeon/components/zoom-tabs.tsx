"use client";

import type { DungeonManifestEntry } from "@/lib/zod";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

type ZoomTabsProps = {
  floor: DungeonManifestEntry["floors"][number];
  tileZoom: number;
  onChange: (zoom: number) => void;
};

export function ZoomTabs({
  floor,
  onChange,
  tileZoom,
}: Readonly<ZoomTabsProps>) {
  return (
    <ToggleGroup
      type="single"
      value={String(tileZoom)}
      onValueChange={(v) => {
        if (v) {
          onChange(Number(v));
        }
      }}
      variant="outline"
    >
      {floor.zoomLevels.map((z) => (
        <ToggleGroupItem key={z.zoom} value={String(z.zoom)}>
          z{z.zoom}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
