"use client";

import type { CostAnalysis, PermutationSpace } from "wowlab-common";

import { useUpdateEffect } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo, useState } from "react";

import { MOCK_SIMC_INPUT } from "@/components/core/simulate/mock-bags/mock-simc-input";
import { useSimcParser } from "@/components/core/simulate/use-simc-parser";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { useCommon, WasmBoundary } from "@/components/shared/wasm";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import type { Profile } from "./shared";

import { buildMarkdown } from "./build-markdown";
import {
  CandidatesTab,
  CostTab,
  CustomSetTab,
  ImportTab,
  OverviewTab,
  PermutationsTab,
} from "./tabs";

const DEFAULT_SHOW_COUNT = 50;

type PermutationsTabsProps = {
  profile: Profile;
  specName: null | string;
};

export function PermutationsContent() {
  return (
    <WasmBoundary fallback={<PermutationsSkeleton />}>
      <PermutationsContentInner />
    </WasmBoundary>
  );
}

function PermutationsContentInner() {
  const content = useIntlayer("permutationsPage");
  const { parseError, profile, setSimcInput, simcInput, specName } =
    useSimcParser();

  useUpdateEffect(() => {
    if (!simcInput) {
      setSimcInput(MOCK_SIMC_INPUT);
    }
  }, []);

  const hasProfile = !!profile;

  return (
    <UrlTabs
      queryKey="tab"
      defaultValue={hasProfile ? "overview" : "import"}
      className="space-y-4"
    >
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="import">{content.tabImport}</TabsTrigger>
        <TabsTrigger value="overview" disabled={!hasProfile}>
          {content.tabOverview}
        </TabsTrigger>
        <TabsTrigger value="candidates" disabled={!hasProfile}>
          {content.tabCandidates}
        </TabsTrigger>
        <TabsTrigger value="permutations" disabled={!hasProfile}>
          {content.tabPermutations}
        </TabsTrigger>
        <TabsTrigger value="cost" disabled={!hasProfile}>
          {content.tabCost}
        </TabsTrigger>
        <TabsTrigger value="custom" disabled={!hasProfile}>
          {content.tabCustomSet}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="import">
        <ImportTab
          onSimcInputChange={setSimcInput}
          parseError={parseError}
          simcInput={simcInput}
        />
      </TabsContent>

      {profile ? (
        <PermutationsTabs profile={profile} specName={specName} />
      ) : null}
    </UrlTabs>
  );
}

function PermutationsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-9 w-24" key={index} />
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

function PermutationsTabs({
  profile,
  specName,
}: Readonly<PermutationsTabsProps>) {
  const common = useCommon();
  const fmtNumber = useNumber();
  const [showCount, setShowCount] = useState(DEFAULT_SHOW_COUNT);

  const space: PermutationSpace | null = useMemo(
    () => common.buildPermutationSpace(profile),
    [profile, common],
  );

  const costs: CostAnalysis | null = useMemo(
    () => (space ? common.computeCostAnalysis(space) : null),
    [space, common],
  );

  const permutations: number[][] = useMemo(
    () => (space ? common.generatePermutationRows(space, showCount) : []),
    [space, showCount, common],
  );

  const markdown = useMemo(
    () =>
      space && costs
        ? buildMarkdown(
            { Doc: common.MarkdownDoc, Table: common.MarkdownTable },
            profile,
            space,
            costs,
            fmtNumber,
          )
        : "",
    [space, profile, costs, common, fmtNumber],
  );

  const isReady = !!space && !!costs;

  if (!isReady) {
    return null;
  }

  return (
    <>
      <TabsContent value="overview">
        <OverviewTab
          costs={costs}
          fmtNumber={fmtNumber}
          markdown={markdown}
          profile={profile}
          space={space}
          specName={specName}
        />
      </TabsContent>

      <TabsContent value="candidates">
        <CandidatesTab space={space} />
      </TabsContent>

      <TabsContent value="permutations">
        <PermutationsTab
          fmtNumber={fmtNumber}
          onShowCountChange={setShowCount}
          permutations={permutations}
          showCount={showCount}
          space={space}
        />
      </TabsContent>

      <TabsContent value="cost">
        <CostTab costs={costs} fmtNumber={fmtNumber} space={space} />
      </TabsContent>

      <TabsContent value="custom">
        <CustomSetTab
          common={common}
          profile={profile}
          space={space}
          specName={specName ?? profile.character.class}
        />
      </TabsContent>
    </>
  );
}
