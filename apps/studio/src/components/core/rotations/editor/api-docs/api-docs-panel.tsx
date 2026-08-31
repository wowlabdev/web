"use client";

import { useIntlayer } from "next-intlayer";

import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";

import type { FieldDescriptorInfo } from "../types";

import { PaneSkeleton } from "../preview/pane-skeleton";
import { CategoryContent } from "./category-content";
import { CategorySidebar } from "./category-sidebar";
import { SortMenu } from "./sort-menu";
import { useApiDocsState } from "./use-api-docs-state";

type ApiDocsPanelProps = {
  auraSlugs: string[];
  descriptors: FieldDescriptorInfo[];
  resourceNames: string[];
  spellSlugs: string[];
};

export function ApiDocsPanel(props: Readonly<ApiDocsPanelProps>) {
  return (
    <NuqsIsland fallback={<PaneSkeleton />}>
      <ApiDocsPanelInner {...props} />
    </NuqsIsland>
  );
}

function ApiDocsPanelInner(props: Readonly<ApiDocsPanelProps>) {
  const content = useIntlayer("rotationEditor");
  const {
    actionDescription,
    activeMeta,
    categoryWithMatchCount,
    effectiveCategory,
    exampleKeysFor,
    handleSelectCategory,
    isSearching,
    operatorDescription,
    query,
    setQuery,
    setSort,
    sort,
    visibleActions,
    visibleFieldsByDomain,
    visibleOperators,
  } = useApiDocsState(props);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>{content.apiTabLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={content.apiSearchPlaceholder.value}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SortMenu value={sort} onChange={setSort} />
        </div>

        <div className="grid gap-3 md:grid-cols-[180px_1fr]">
          <CategorySidebar
            active={effectiveCategory}
            categories={categoryWithMatchCount}
            isSearching={isSearching}
            onSelect={handleSelectCategory}
          />
          <div className="min-w-0">
            <CategoryContent
              actionDescription={actionDescription}
              activeCategory={effectiveCategory}
              activeLabel={activeMeta?.label ?? ""}
              activeMatches={activeMeta?.matches ?? 0}
              exampleKeysFor={exampleKeysFor}
              isSearching={isSearching}
              operatorDescription={operatorDescription}
              visibleActions={visibleActions}
              visibleFieldsByDomain={visibleFieldsByDomain}
              visibleOperators={visibleOperators}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
