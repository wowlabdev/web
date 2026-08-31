"use client";

import type { TimelineViewport } from "wowlab-common";

import { ChevronDownIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type {
  TimelineEvent,
  TimelineLane,
} from "@/components/shared/ui/charts";

import { GameTooltip, GameTooltipWrapper } from "@/components/shared/game";
import { Timeline } from "@/components/shared/ui/charts";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";
import { cn } from "@wowlab/shared/lib/utils";

import type { AuraCategory } from "./aura-classify";
import type { AuraGroup } from "./use-aura-lanes";

import { auraCategoryColor } from "./aura-classify";
import { AuraLaneIcon, AuraLanePlaceholder } from "./aura-lane-icon";

const LANE_ICON_GUTTER = 28;

type AuraCategoryGroupProps = {
  group: AuraGroup;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewportChange: (viewport: TimelineViewport) => void;
  durationMs: number;
  viewport: TimelineViewport;
};

export function AuraCategoryGroup({
  durationMs,
  group,
  isOpen,
  onOpenChange,
  onViewportChange,
  viewport,
}: Readonly<AuraCategoryGroupProps>) {
  const content = useIntlayer("rotationEditor");

  const { events, lanes } = useMemo(() => {
    const timelineLanes: TimelineLane[] = [];
    const timelineEvents: TimelineEvent[] = [];

    for (const lane of group.lanes) {
      const tooltip =
        lane.auraId === null ? (
          <div className="space-y-0.5 text-xs">
            <div className="font-medium">{lane.displayName}</div>
            <div className="text-muted-foreground">{lane.source}</div>
          </div>
        ) : (
          <GameTooltip id={lane.auraId} kind="aura" />
        );

      timelineLanes.push({
        color: lane.color,
        icon: (
          <GameTooltipWrapper tooltip={tooltip}>
            <span className="block cursor-default">
              {lane.auraId === null ? (
                <AuraLanePlaceholder color={lane.color} />
              ) : (
                <AuraLaneIcon auraId={lane.auraId} label={lane.displayName} />
              )}
            </span>
          </GameTooltipWrapper>
        ),
        id: lane.slug,
        label: lane.displayName,
      });

      for (const [i, window] of lane.windows.entries()) {
        timelineEvents.push({
          color: lane.color,
          endMs: window.endMs,
          id: `${lane.slug}-${i}`,
          label: lane.displayName,
          laneId: lane.slug,
          startMs: window.startMs,
          tooltip,
        });
      }
    }

    return { events: timelineEvents, lanes: timelineLanes };
  }, [group.lanes]);

  const categoryLabels: Record<AuraCategory, string> = {
    buff: content.previewAuraCategoryBuff.value,
    debuff: content.previewAuraCategoryDebuff.value,
    passive: content.previewAuraCategoryPassive.value,
    pet: content.previewAuraCategoryPet.value,
    proc: content.previewAuraCategoryProc.value,
    system: content.previewAuraCategorySystem.value,
  };

  return (
    <Collapsible onOpenChange={onOpenChange} open={isOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left hover:bg-muted/50"
          type="button"
        >
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: auraCategoryColor(group.category) }}
          />
          <span className="text-sm font-medium">
            {categoryLabels[group.category]}
          </span>
          <Badge className="tabular-nums" variant="secondary">
            {content.previewAuraGroupCount({ count: group.lanes.length })}
          </Badge>
          <Badge className="tabular-nums" variant="outline">
            {content.previewAuraUptime({
              pct: Math.round(group.avgUptimePct),
            })}
          </Badge>
          <ChevronDownIcon
            className={cn(
              "ml-auto size-4 shrink-0 text-muted-foreground transition-transform",
              !isOpen && "-rotate-90",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-1">
          <Timeline
            durationMs={durationMs}
            events={events}
            gutterWidth={LANE_ICON_GUTTER}
            lanes={lanes}
            onViewportChange={onViewportChange}
            viewport={viewport}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
