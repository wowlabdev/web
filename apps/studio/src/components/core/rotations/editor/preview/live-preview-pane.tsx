"use client";

import type { SpecIntrospection } from "wowlab-common";

import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { Suspense, useState } from "react";

import { SpecCharacterPanel } from "@/components/shared/character";
import { type TimelineViewport } from "@/components/shared/ui/charts";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { useCommon } from "@/components/shared/wasm";
import { useResolvedSpecIntrospection } from "@/lib/query/services";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { ApiDocsPanel } from "../api-docs/api-docs-panel";
import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import { useEditorContext } from "../use-editor-context";
import { buildDiagnosticsMarkdown } from "./build-diagnostics";
import { PREVIEW_TABS, type PreviewTab } from "./constants";
import { EnvelopePanel } from "./envelope-panel";
import { LivePreviewOverview } from "./live-preview-overview";
import { PaneSkeleton } from "./pane-skeleton";
import { SpellDetailPanel } from "./spell-detail-panel";
import { type PreviewControls, useLiveTrace } from "./use-live-trace";
import { usePreviewQuery } from "./use-preview-query";
import { usePreviewSections } from "./use-preview-sections";
import { toPreviewControls } from "./utils";
import { WhyNotPanel } from "./why-not-panel";

const DEFAULT_TIMELINE_VIEWPORT: TimelineViewport = { panMs: 0, zoom: 1 };
const PREVIEW_TAB_VALUES = new Set<string>(PREVIEW_TABS);

export function LivePreviewPane() {
  return (
    <Suspense fallback={<PaneSkeleton />}>
      <LivePreviewPaneInner />
    </Suspense>
  );
}

function isPreviewTab(value: string): value is PreviewTab {
  return PREVIEW_TAB_VALUES.has(value);
}

function LivePreviewPaneInner() {
  const common = useCommon();
  const content = useIntlayer("rotationEditor");
  const { query, setQuery } = usePreviewQuery();
  const controls = toPreviewControls(query);
  const { completedAt, error, retry, runState, simConfig, trace } =
    useLiveTrace(controls);
  const setTrace = useEditorUi((s) => s.setTrace);
  const [timelineViewport, setTimelineViewport] = useState<TimelineViewport>(
    DEFAULT_TIMELINE_VIEWPORT,
  );
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const script = useEditorDocument((s) => s.script);
  const specId = useEditorDocument((s) => s.metadata.specId);
  const setControlsFromBar = useMemoizedFn((next: PreviewControls) =>
    setQuery({
      archetype: next.archetype,
      duration: next.durationS,
      seed: next.seed,
      targets: next.targetCount,
    }),
  );

  const { data: introData } = useResolvedSpecIntrospection(specId);
  const intro: null | SpecIntrospection = introData ?? null;

  const { auraSlugs, descriptors, resourceNames, spellSlugs } =
    useEditorContext(specId);

  const validation = useEditorUi((s) => s.validation);
  const buildDiagnostics = useMemoizedFn(() =>
    buildDiagnosticsMarkdown({
      common,
      controls,
      error,
      intro,
      runState,
      script,
      simConfig,
      specId,
      trace,
      validation,
    }),
  );

  useUpdateEffect(() => {
    if (runState === "ok") {
      setTrace(trace);
    } else if (runState === "error" || runState === "idle") {
      setTrace(null);
    }
  }, [runState, trace, setTrace]);

  const previewSections = usePreviewSections({
    intro,
    onViewportChange: setTimelineViewport,
    trace,
    viewport: timelineViewport,
  });
  const handleTabChange = useMemoizedFn((value: string) => {
    if (isPreviewTab(value)) {
      setQuery({ tab: value });
    }
  });

  return (
    <UrlTabs value={query.tab} onValueChange={handleTabChange}>
      <div className="overflow-x-auto">
        <TabsList variant="line">
          <TabsTrigger value="overview">
            {content.previewTabOverview}
          </TabsTrigger>
          <TabsTrigger value="character">
            {content.previewTabCharacter}
          </TabsTrigger>
          <TabsTrigger value="diagnose">
            {content.previewTabDiagnose}
          </TabsTrigger>
          <TabsTrigger value="spell">{content.previewTabSpell}</TabsTrigger>
          <TabsTrigger value="api">{content.apiTabLabel}</TabsTrigger>
          <TabsTrigger value="envelope">
            {content.previewTabEnvelope}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-3">
        <LivePreviewOverview
          controls={controls}
          error={error}
          getDiagnostics={buildDiagnostics}
          lastRunAt={completedAt}
          onControlsChange={setControlsFromBar}
          previewSections={previewSections}
          query={query}
          retry={retry}
          runState={runState}
          setQuery={setQuery}
          trace={trace}
        />
      </TabsContent>

      <TabsContent value="character">
        <SpecCharacterPanel specId={specId} />
      </TabsContent>

      <TabsContent value="diagnose">
        <WhyNotPanel selectionFocus={selectionFocus} trace={trace} />
      </TabsContent>

      <TabsContent value="spell">
        <SpellDetailPanel />
      </TabsContent>

      <TabsContent value="api">
        <ApiDocsPanel
          auraSlugs={auraSlugs}
          descriptors={descriptors}
          resourceNames={resourceNames}
          spellSlugs={spellSlugs}
        />
      </TabsContent>

      <TabsContent value="envelope">
        <EnvelopePanel simConfig={simConfig} />
      </TabsContent>
    </UrlTabs>
  );
}
