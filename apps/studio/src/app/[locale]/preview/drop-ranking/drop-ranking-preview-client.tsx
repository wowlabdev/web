"use client";

import { RankingTable } from "@/components/core/results/tournament/ranking-table";
import { LANDING_DROP_RANKING } from "@/components/shared/landing/__fixtures__/landing-fixtures";

export function DropRankingPreviewClient() {
  return <RankingTable permutations={LANDING_DROP_RANKING} />;
}
