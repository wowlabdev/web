"use client";

import { useIntlayer } from "next-intlayer";

import type { DungeonManifestEntry } from "@/lib/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type DungeonSelectProps = {
  dungeons: ReadonlyArray<DungeonManifestEntry>;
  value: string;
  onChange: (key: string) => void;
};

export function DungeonSelect({
  dungeons,
  onChange,
  value,
}: Readonly<DungeonSelectProps>) {
  const content = useIntlayer("plan");

  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">{content.dungeonLabel}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-auto bg-background px-2 py-1 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dungeons
            .filter((d) =>
              d.floors.some((f) => f.hasData && f.zoomLevels.length > 0),
            )
            .map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </label>
  );
}
