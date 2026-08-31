"use client";

import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import { QueryIsland } from "@/components/shared/islands/query-island";
import { SidebarLayout } from "@/components/shared/layout";
import {
  Skeleton,
  SkeletonList,
} from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";

import { JournalContent } from "./index";
import { LootGridRowSkeleton } from "./loot-grid-row-skeleton";

const LOOT_SKELETON_ROWS = ["r1", "r2", "r3", "r4", "r5", "r6"];

export function JournalPage() {
  return (
    <QueryIsland>
      <NuqsIsland fallback={<JournalSkeleton />}>
        <JournalContent />
      </NuqsIsland>
    </QueryIsland>
  );
}

export function JournalSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-col gap-1.5 border-l-[3px] border-l-rail-purple pb-4 fl-px-0/1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 border bg-card p-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>

      <SidebarLayout as="section">
        <Card size="sm" className="self-start shadow-none lg:sticky lg:top-4">
          <CardHeader className="space-y-3 pb-3">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-full" />
          </CardHeader>
          <CardContent>
            <SkeletonList count={10} gapClassName="space-y-1" />
          </CardContent>
        </Card>

        <Card size="sm" className="overflow-hidden shadow-none">
          <CardHeader className="border-b px-3 pb-3 pt-3">
            <div className="grid gap-2 pb-3 xl:grid-cols-[1fr_auto] xl:items-start">
              <div className="flex min-w-0 gap-3">
                <Skeleton className="size-16 shrink-0" />
                <div className="min-w-0 space-y-1.5">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-7 min-w-48 xl:w-64" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border border">
              {LOOT_SKELETON_ROWS.map((rowKey) => (
                <LootGridRowSkeleton key={rowKey} />
              ))}
            </div>
          </CardContent>
        </Card>
      </SidebarLayout>
    </div>
  );
}
