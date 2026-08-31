import { TOURNAMENT_FIXTURE } from "@/components/core/results/tournament/__fixtures__/tournament-fixture";
import { TournamentResultView } from "@/components/core/results/tournament/tournament-result-view";

export default function TournamentDevPage() {
  return (
    <div className="container mx-auto p-6">
      <TournamentResultView tournament={TOURNAMENT_FIXTURE} />
    </div>
  );
}
