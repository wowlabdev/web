import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TOURNAMENT_FIXTURE } from "./__fixtures__/tournament-fixture";
import { RankingTable } from "./ranking-table";
import { TournamentResultView } from "./tournament-result-view";

vi.mock("next-intlayer", () => ({
  useIntlayer: () => ({
    dps: { value: "DPS" },
    tournamentBaseline: { value: "Baseline" },
    tournamentBaselineDps: { value: "Baseline DPS" },
    tournamentBestDps: { value: "Best DPS" },
    tournamentDelta: { value: "Delta" },
    tournamentDpsGain: { value: "DPS Gain" },
    tournamentItem: { value: "Item" },
    tournamentMarginalDelta: { value: "Marginal" },
    tournamentPermutations: { value: "Permutations" },
    tournamentPhases: { value: "Phases" },
    tournamentRank: { value: "Rank" },
    tournamentRanking: { value: "Ranking" },
    tournamentSlot: { value: "Slot" },
    tournamentSlotBreakdown: { value: "Slot Breakdown" },
    tournamentSlotChanges: { value: "Slot Changes" },
    tournamentStderr: { value: "CI95" },
    tournamentTotalIterations: { value: "Iterations" },
    tournamentWinnerDps: { value: "Winner DPS" },
    tournamentWinRate: { value: "Win Rate" },
  }),
}));

describe("TournamentResultView", () => {
  it("renders winner DPS from fixture", () => {
    render(<TournamentResultView tournament={TOURNAMENT_FIXTURE} />);
    expect(screen.getAllByText(/15,251/).length).toBeGreaterThan(0);
  });

  it("shows permutation count and phase count", () => {
    render(<TournamentResultView tournament={TOURNAMENT_FIXTURE} />);
    expect(screen.getAllByText("3 Phases").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Permutations").length).toBeGreaterThan(0);
  });

  it("renders slot breakdown rows", () => {
    render(<TournamentResultView tournament={TOURNAMENT_FIXTURE} />);
    expect(screen.getAllByText("#5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("#9").length).toBeGreaterThan(0);
  });
});

describe("RankingTable", () => {
  it("sorts permutations descending by mean_dps", () => {
    const shuffled = TOURNAMENT_FIXTURE.top_permutations.toReversed();

    render(<RankingTable permutations={shuffled} />);
    const rankCells = screen.getAllByText(/^#\d+$/);

    expect(rankCells[0].textContent).toBe("#1");
    expect(rankCells.at(-1)!.textContent).toBe(
      `#${TOURNAMENT_FIXTURE.top_permutations.length}`,
    );
  });

  it("shows baseline badge for the permutation with no diffs", () => {
    render(<RankingTable permutations={TOURNAMENT_FIXTURE.top_permutations} />);
    expect(screen.getAllByText("Baseline").length).toBeGreaterThan(0);
  });
});
