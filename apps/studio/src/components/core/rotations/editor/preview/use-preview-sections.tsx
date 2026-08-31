"use client";

import type { SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { type ReactNode, useMemo } from "react";

import {
  ChartTabs,
  type TimelineViewport,
} from "@/components/shared/ui/charts";

import { AuraTrack } from "./aura-track";
import { DpsGraph } from "./dps-graph";
import { ResourceFluxGraph } from "./resource-flux-graph";
import { ResourceGraph } from "./resource-graph";
import { SpellBreakdownGraph } from "./spell-breakdown-graph";
import { TimelineTrack } from "./timeline-track";

const MS_PER_SECOND = 1000;

type BuildSectionsArgs = {
  intro: null | SpecIntrospection;
  onViewportChange: (viewport: TimelineViewport) => void;
  trace: IterationTrace | null;
  viewport: TimelineViewport;
};

type PreviewSectionConfig = {
  description: ReactNode;
  node: ReactNode;
  title: ReactNode;
};

export function usePreviewSections({
  intro,
  onViewportChange,
  trace,
  viewport,
}: BuildSectionsArgs): Record<string, PreviewSectionConfig> {
  const content = useIntlayer("rotationEditor");
  const resourcePrimaryName = useMemo(
    () => trace?.resourceSamples[0]?.resourceName ?? null,
    [trace],
  );
  const auraLaneCount = useMemo(
    () => new Set((trace?.auraEvents ?? []).map((e) => e.auraSlug)).size,
    [trace],
  );

  if (!trace) {
    return {};
  }

  const seconds = Math.round(trace.durationMs / MS_PER_SECOND);

  return {
    auras: {
      description:
        auraLaneCount === 0
          ? content.previewAurasEmpty
          : content.previewAurasDescription({ count: auraLaneCount }),
      node: (
        <AuraTrack
          intro={intro}
          onViewportChange={onViewportChange}
          trace={trace}
          viewport={viewport}
        />
      ),
      title: content.previewAurasTitle,
    },
    breakdown: {
      description: content.previewBreakdownDescription,
      node: (
        <ChartTabs
          queryKey="breakdownMetric"
          tabs={[
            {
              chart: (
                <SpellBreakdownGraph
                  intro={intro}
                  metric="damage"
                  trace={trace}
                />
              ),
              label: content.previewBreakdownDamageTab,
              value: "damage",
            },
            {
              chart: (
                <SpellBreakdownGraph
                  intro={intro}
                  metric="casts"
                  trace={trace}
                />
              ),
              label: content.previewBreakdownCastsTab,
              value: "casts",
            },
          ]}
        />
      ),
      title: content.previewBreakdownTitle,
    },
    dps: {
      description: content.previewDpsDescription({ seconds }),
      node: <DpsGraph trace={trace} />,
      title: content.previewDpsTitle,
    },
    resources: {
      description: resourcePrimaryName
        ? content.previewResourcesDescription({ name: resourcePrimaryName })
        : content.previewResourcesEmpty,
      node: (
        <ChartTabs
          queryKey="resourceMetric"
          tabs={[
            {
              chart: <ResourceGraph trace={trace} />,
              label: content.previewResourcesLevelTab,
              value: "level",
            },
            {
              chart: <ResourceFluxGraph trace={trace} />,
              label: content.previewResourcesFluxTab,
              value: "flux",
            },
          ]}
        />
      ),
      title: content.previewResourcesTitle,
    },
    timeline: {
      description: content.previewTimelineDescription({ seconds }),
      node: (
        <TimelineTrack
          intro={intro}
          onViewportChange={onViewportChange}
          trace={trace}
          viewport={viewport}
        />
      ),
      title: content.previewTimelineTitle,
    },
  };
}
