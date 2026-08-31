"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";

import type { HookKind } from "./hook-registry-types";

import { HookDemoCard } from "./hook-demo-card";
import { HOOK_REGISTRY } from "./hook-registry";

const FILTER_KEYS = ["name", "returnType", "returns", "source"] as const;

export function HookSection({
  filter,
  kind,
}: Readonly<{ filter: string; kind: HookKind }>) {
  const content = useIntlayer("hooksPage");
  const kindEntries = useMemo(
    () => HOOK_REGISTRY.filter((entry) => entry.kind === kind),
    [kind],
  );
  const entries = useFuzzySearch({
    items: kindEntries,
    keys: FILTER_KEYS,
    query: filter,
  });

  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm">{content.noResults}</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {entries.map((entry) => (
        <HookDemoCard key={entry.id} entry={entry}>
          <entry.Demo />
        </HookDemoCard>
      ))}
    </div>
  );
}
