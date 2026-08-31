"use client";

import { useQueryState } from "nuqs";

import type { TimeRange } from "@/lib/metrics";

import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import { RANGES } from "@/lib/metrics";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Tabs, TabsList, TabsTrigger } from "@wowlab/shared/components/ui/tabs";

type RangeSelectorProps = {
  queryKey: string;
  defaultValue?: TimeRange;
};

export function RangeSelector({
  defaultValue = "1h",
  queryKey,
}: Readonly<RangeSelectorProps>) {
  return (
    <NuqsIsland fallback={<Skeleton className="h-9 w-48" />}>
      <RangeSelectorInner queryKey={queryKey} defaultValue={defaultValue} />
    </NuqsIsland>
  );
}

function RangeSelectorInner({
  defaultValue = "1h",
  queryKey,
}: Readonly<RangeSelectorProps>) {
  const [value, setValue] = useQueryState(queryKey, {
    defaultValue,
    history: "replace",
    shallow: false,
  });

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as TimeRange)}>
      <TabsList className="w-fit">
        {RANGES.map((r) => (
          <TabsTrigger key={r} value={r}>
            {r}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
