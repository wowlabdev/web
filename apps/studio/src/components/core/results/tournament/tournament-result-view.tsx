"use client";

import type { TournamentView } from "wowlab-common";

import { CopyToAddonButton } from "./copy-to-addon-button";
import { RankingTable } from "./ranking-table";
import { SlotBreakdown } from "./slot-breakdown";
import { WinnerCard } from "./winner-card";

type TournamentResultViewProps = {
  tournament: TournamentView;
  spec?: string;
  jobId?: string;
};

export function TournamentResultView({
  jobId,
  spec,
  tournament,
}: Readonly<TournamentResultViewProps>) {
  return (
    <div className="space-y-6">
      <WinnerCard stats={tournament.stats} />
      {spec ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <CopyToAddonButton
            tournament={tournament}
            spec={spec}
            jobId={jobId}
            kind="bib"
          />
          <CopyToAddonButton
            tournament={tournament}
            spec={spec}
            jobId={jobId}
            kind="drops"
          />
        </div>
      ) : null}
      <RankingTable permutations={tournament.top_permutations} />
      <SlotBreakdown slotRankings={tournament.slot_rankings} />
    </div>
  );
}
