"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { QueryListResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { useSpecList } from "@/lib/game-data";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "./shared";

export const RANKINGS_SEASONS_KEY = ["rankings", "seasons"] as const;

export const RANKINGS_SPECS_KEY = ["rankings", "specs"] as const;

export const RANKINGS_SNAPSHOTS_KEY = ["rankings", "snapshots"] as const;

export type SimRankingRow = Row<"sim_rankings">;

export type SimRankingSnapshotRow = Row<"sim_rankings_snapshots">;

export type SimSeasonRow = Row<"sim_seasons">;

export type SpecRankingRow = {
  className: string | null;
  rankDelta: number | null;
  scoreDelta: number | null;
  specIcon: string | null;
  specName: string | null;
} & SimRankingRow;

type SpecLookup = {
  class_name: string;
  file_name: string;
  id: number;
  name: string;
};

export function useRankingSeasons(): QueryListResult<SimSeasonRow> {
  return toQueryListResult(
    useQuery<SimSeasonRow[]>({
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("sim_seasons")
          .select("*")
          .order("starts_at", { ascending: false });

        throwIfError(error);

        return data ?? [];
      },
      queryKey: RANKINGS_SEASONS_KEY,
    }),
  );
}

export function useSpecRankings(seasonId: string) {
  const seasonsQuery = useRankingSeasons();
  const seasons = useMemo(() => seasonsQuery.data ?? [], [seasonsQuery.data]);

  const resolvedSeasonId = useMemo(() => {
    const activeSeasonId = seasons.find(
      (season) => season.is_active,
    )?.season_id;
    const latestSeasonId = seasons.length > 0 ? seasons[0].season_id : null;

    return seasonId || activeSeasonId || latestSeasonId;
  }, [seasonId, seasons]);

  const rankingsQuery = useQuery<SimRankingRow[]>({
    enabled: Boolean(resolvedSeasonId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sim_rankings")
        .select("*")
        .eq("season_id", resolvedSeasonId!)
        .order("rank", { ascending: true })
        .order("spec_id", { ascending: true });

      throwIfError(error);

      return data ?? [];
    },
    queryKey: [...RANKINGS_SPECS_KEY, resolvedSeasonId],
    refetchInterval: 60_000,
  });

  const rankingSpecIds = useMemo(
    () => [...new Set((rankingsQuery.data ?? []).map((row) => row.spec_id))],
    [rankingsQuery.data],
  );

  const snapshotsQuery = useQuery<SimRankingSnapshotRow[]>({
    enabled: Boolean(resolvedSeasonId) && rankingSpecIds.length > 0,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sim_rankings_snapshots")
        .select("*")
        .eq("season_id", resolvedSeasonId!)
        .in("spec_id", rankingSpecIds)
        .order("snapshot_at", { ascending: false })
        .limit(5000);

      throwIfError(error);

      return data ?? [];
    },
    queryKey: [...RANKINGS_SNAPSHOTS_KEY, resolvedSeasonId, rankingSpecIds],
    refetchInterval: 60_000,
  });

  const { data: specLookups } = useSpecList();

  const snapshotWindow = useMemo(() => {
    const rows = snapshotsQuery.data ?? [];
    const latestByJob = new Map<string, SimRankingSnapshotRow>();
    const previousByJob = new Map<string, SimRankingSnapshotRow>();
    const times: string[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      if (!seen.has(row.snapshot_at)) {
        seen.add(row.snapshot_at);
        times.push(row.snapshot_at);
      }

      if (times.length === 1 && row.snapshot_at === times[0]) {
        latestByJob.set(row.job_id, row);
        continue;
      }

      if (
        times.length >= 2 &&
        row.snapshot_at === times[1] &&
        !previousByJob.has(row.job_id)
      ) {
        previousByJob.set(row.job_id, row);
        continue;
      }

      if (
        times.length >= 2 &&
        row.snapshot_at !== times[0] &&
        row.snapshot_at !== times[1]
      ) {
        break;
      }
    }

    return {
      latestByJob,
      latestSnapshotAt: times[0] ?? null,
      previousByJob,
    };
  }, [snapshotsQuery.data]);

  const data = useMemo<SpecRankingRow[]>(() => {
    const rankings = rankingsQuery.data ?? [];
    const specs: SpecLookup[] = specLookups ?? [];

    return rankings.map((row) => {
      const spec = specs.find((candidate) => candidate.id === row.spec_id);
      const latestSnapshot = snapshotWindow.latestByJob.get(row.job_id);
      const previousSnapshot = snapshotWindow.previousByJob.get(row.job_id);
      const effectiveRank = latestSnapshot?.rank ?? row.rank;
      const effectiveScore = latestSnapshot?.score ?? row.score;
      const rankDelta =
        previousSnapshot === undefined
          ? null
          : previousSnapshot.rank - effectiveRank;
      const scoreDelta =
        previousSnapshot === undefined
          ? null
          : effectiveScore - previousSnapshot.score;

      return {
        ...row,
        className: spec?.class_name ?? null,
        rankDelta,
        scoreDelta,
        specIcon: spec?.file_name ?? null,
        specName: spec?.name ?? null,
      };
    });
  }, [rankingsQuery.data, snapshotWindow, specLookups]);

  const selectedSeason = useMemo(
    () =>
      seasons.find((season) => season.season_id === resolvedSeasonId) ?? null,
    [resolvedSeasonId, seasons],
  );

  return {
    data,
    error: rankingsQuery.error ?? snapshotsQuery.error ?? seasonsQuery.error,
    isError:
      rankingsQuery.isError || snapshotsQuery.isError || seasonsQuery.isError,
    isFetching:
      rankingsQuery.isFetching ||
      snapshotsQuery.isFetching ||
      seasonsQuery.isFetching,
    isLoading:
      rankingsQuery.isLoading ||
      snapshotsQuery.isLoading ||
      seasonsQuery.isLoading ||
      specLookups === undefined,
    latestSnapshotAt: snapshotWindow.latestSnapshotAt,
    seasonId: resolvedSeasonId,
    seasons,
    selectedSeason,
  };
}
