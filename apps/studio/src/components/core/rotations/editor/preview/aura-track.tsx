"use client";

import type { SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { TimelineViewport } from "@/components/shared/ui/charts";

import type { AuraCategory } from "./aura-classify";
import type { AuraSort } from "./use-aura-lanes";

import { AuraCategoryGroup } from "./aura-category-group";
import { AuraTrackToolbar } from "./aura-track-toolbar";
import { useAuraLanes } from "./use-aura-lanes";

type AuraTrackProps = {
  intro: null | SpecIntrospection;
  onViewportChange: (viewport: TimelineViewport) => void;
  trace: IterationTrace | null;
  viewport: TimelineViewport;
};

export function AuraTrack({
  intro,
  onViewportChange,
  trace,
  viewport,
}: Readonly<AuraTrackProps>) {
  const content = useIntlayer("rotationEditor");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<AuraSort>("first");
  const [collapsed, setCollapsed] = useState<Set<AuraCategory>>(
    () => new Set(),
  );

  const { groups, totalLanes } = useAuraLanes({ intro, search, sort, trace });

  const handleOpenChange = useMemoizedFn(
    (category: AuraCategory, open: boolean) => {
      setCollapsed((prev) => {
        const next = new Set(prev);

        if (open) {
          next.delete(category);
        } else {
          next.add(category);
        }

        return next;
      });
    },
  );

  if (!trace) {
    return null;
  }

  if (totalLanes === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {content.previewAurasEmpty}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <AuraTrackToolbar
        onSearchChange={setSearch}
        onSortChange={setSort}
        search={search}
        sort={sort}
      />
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {content.previewAurasNoMatch}
        </p>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <AuraCategoryGroup
              durationMs={trace.durationMs}
              group={group}
              isOpen={!collapsed.has(group.category)}
              key={group.category}
              onOpenChange={(open) => handleOpenChange(group.category, open)}
              onViewportChange={onViewportChange}
              viewport={viewport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
