"use client";

import { useCreation } from "ahooks";
import { ShirtIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { parseAsInteger, useQueryState } from "nuqs";

import { EquipmentGrid } from "@/components/shared/character/equipment-grid";
import { useAverageItemLevel } from "@/components/shared/character/use-average-item-level";
import { GameSpec, SpecPicker } from "@/components/shared/game";
import { NuqsIsland } from "@/components/shared/islands";
import { useCommon, useEngine, WasmBoundary } from "@/components/shared/wasm";
import { usePaperdolls } from "@/lib/query/services";
import { parseImplementedSpecs, parseSimcProfile } from "@/lib/wasm/api";
import {
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";

export function PaperdollsPage() {
  return (
    <NuqsIsland fallback={<PaperdollsSkeleton />}>
      <PaperdollsPageInner />
    </NuqsIsland>
  );
}

function PaperdollsBody() {
  const content = useIntlayer("paperdollsPage");
  const common = useCommon();
  const engine = useEngine();
  const { data: paperdolls } = usePaperdolls();
  const rows = paperdolls ?? [];
  const [selectedSpecId, setSelectedSpecId] = useQueryState(
    "spec",
    parseAsInteger,
  );
  const implementedSpecs = useCreation(
    () => parseImplementedSpecs(common, engine.getImplementedSpecs()),
    [common, engine],
  );
  const activeSpecId =
    selectedSpecId ?? (rows.length > 0 ? rows[0].spec_id : null);
  const activeRow = rows.find((row) => row.spec_id === activeSpecId) ?? null;
  const profile = useCreation(() => {
    if (!activeRow) {
      return null;
    }

    try {
      return parseSimcProfile(common, activeRow.simc);
    } catch {
      return null;
    }
  }, [common, activeRow]);
  const averageItemLevel = useAverageItemLevel(profile);
  const equippedCount = profile?.equipment.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <SpecPicker
        isCompact
        onChange={(specId) => void setSelectedSpecId(specId)}
        specs={implementedSpecs}
        value={activeSpecId}
      />

      {profile ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {activeRow ? (
              <GameSpec size="md" specId={activeRow.spec_id} />
            ) : null}
            <StatCard
              className="w-full sm:max-w-xs"
              changePercentage={content.itemsEquipped(equippedCount).value}
              icon={<ShirtIcon className="size-4" />}
              title={content.averageItemLevel.value}
              value={averageItemLevel == null ? "—" : String(averageItemLevel)}
            />
          </div>
          <Card>
            <CardContent>
              <EquipmentGrid profile={profile} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {activeSpecId == null ? content.empty : content.emptyForSpec}
        </p>
      )}
    </div>
  );
}

function PaperdollsPageInner() {
  return (
    <WasmBoundary fallback={<PaperdollsSkeleton />}>
      <PaperdollsBody />
    </WasmBoundary>
  );
}

function PaperdollsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-48" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Skeleton className="h-12 w-48" />
          <SkeletonCard
            className="w-full sm:max-w-xs"
            headerWidth="w-28"
            bodyLines={1}
          />
        </div>
        <Card>
          <CardContent>
            <SkeletonGrid cols={2} count={6} cellClassName="h-12" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
