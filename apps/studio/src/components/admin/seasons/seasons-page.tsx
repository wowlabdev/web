"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { useSeasonRollover, useSeasons } from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { NewSeasonDialog } from "./new-season-dialog";
import { SeasonsTableCard } from "./seasons-table-card";

export function SeasonsPage() {
  const content = useIntlayer("admin");
  const { data, isLoading } = useSeasons();
  const rollover = useSeasonRollover();

  const lastResult = useMemo(() => rollover.data?.[0] ?? null, [rollover.data]);

  async function handleCreate(input: {
    newSeasonId: string;
    rulesetVersion: number;
    startsAt: string;
  }) {
    await rollover.mutateAsync(input);
  }

  return (
    <div className="space-y-6">
      {rollover.error && (
        <Alert variant="destructive">
          <AlertTitle>{content.seasons.requestFailed}</AlertTitle>
          <AlertDescription>{rollover.error.message}</AlertDescription>
        </Alert>
      )}

      {lastResult && (
        <Alert>
          <AlertTitle>{content.seasons.rolloverComplete}</AlertTitle>
          <AlertDescription>
            {content.seasons.rolloverMessage({
              jobs: lastResult.jobs_in_old_season,
              newSeason: lastResult.new_season_id,
              oldSeason: lastResult.old_season_id,
            })}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <NewSeasonDialog
          onCreate={handleCreate}
          isPending={rollover.isPending}
        />
      </div>

      <SeasonsTableCard data={data} isLoading={isLoading} />
    </div>
  );
}
