"use client";

import { useMemo } from "react";

import { DEFAULT_CLASS_ID } from "@/components/int/__fixtures__/game-fixtures";
import { useClass, useClassList, useGlobalColors } from "@/lib/game-data";
import { QUALITY_COLOR_NAMES } from "@/lib/game/quality";
import { Badge } from "@wowlab/shared/components/ui/badge";

import { ByIdDemo } from "./by-id-demo";
import { SimpleListDemo } from "./demo-helpers";
import { useEntityColumns } from "./use-entity-columns";

export function UseClassDemo() {
  return (
    <ByIdDemo
      useResult={useClass}
      defaultId={DEFAULT_CLASS_ID}
      render={(id, data) => (
        <span style={{ color: data?.color ?? undefined }}>
          {data?.name ?? id}
        </span>
      )}
    />
  );
}

export function UseClassListDemo() {
  const columns = useEntityColumns();

  return (
    <SimpleListDemo
      useResult={useClassList}
      columns={columns.class}
      title="useClassList"
    />
  );
}

export function UseGlobalColorsDemo() {
  const { data } = useGlobalColors();
  const colors = useMemo(
    () =>
      (data ?? []).filter((color) =>
        (QUALITY_COLOR_NAMES as readonly string[]).includes(color.name),
      ),
    [data],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Badge
          key={color.id}
          variant="outline"
          style={{ borderColor: color.color, color: color.color }}
        >
          {color.name}
        </Badge>
      ))}
    </div>
  );
}
