import type { ResolvedItem } from "wowlab-common";

import { stableIndexedId } from "@wowlab/shared/lib/id";

type LootStatListProps = {
  itemId: number;
  stats: ResolvedItem["stats"];
};

export function LootStatList({ itemId, stats }: Readonly<LootStatListProps>) {
  return (
    <div
      role="list"
      className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-1.5 text-xs 2xl:grid-cols-1"
    >
      {stats.map((stat, index) => (
        <div
          key={stableIndexedId(
            "journal-scaled-stat",
            [itemId, stat.stat_type],
            index,
          )}
          role="listitem"
          className="flex min-w-0 items-baseline justify-between gap-2"
        >
          <span className="truncate text-muted-foreground">
            {stat.stat_name}
          </span>
          <span className="shrink-0 font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
            +{stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
