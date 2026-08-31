import type { TournamentView } from "wowlab-common";

export const TOURNAMENT_FIXTURE: TournamentView = {
  slot_rankings: [
    {
      items: [
        {
          best_perm_dps: 15_250.5,
          best_perm_rank: 0,
          bonus_id_hash: 123_456,
          ci95_half: 45.2,
          item_id: 207_217,
          marginal_dps_delta: 375.3,
          win_rate_pct: 50,
        },
        {
          best_perm_dps: 14_100.8,
          best_perm_rank: 2,
          bonus_id_hash: 0,
          ci95_half: 61.8,
          item_id: 207_100,
          marginal_dps_delta: 0,
          win_rate_pct: 50,
        },
      ],
      slot_index: 5,
    },
    {
      items: [
        {
          best_perm_dps: 15_250.5,
          best_perm_rank: 0,
          bonus_id_hash: 789_012,
          ci95_half: 45.2,
          item_id: 207_280,
          marginal_dps_delta: 1149.7,
          win_rate_pct: 50,
        },
        {
          best_perm_dps: 14_875.2,
          best_perm_rank: 1,
          bonus_id_hash: 0,
          ci95_half: 52.1,
          item_id: 207_050,
          marginal_dps_delta: 0,
          win_rate_pct: 50,
        },
      ],
      slot_index: 9,
    },
  ],
  stats: {
    baseline_dps: 12_000,
    dps_gain: 3250.5,
    dps_gain_pct: 27.08,
    phases_completed: 3,
    total_iterations: 100_000,
    total_permutations: 4,
    winner_dps: 15_250.5,
  },
  top_permutations: [
    {
      ci95_half: 45.2,
      diffs: [
        { bonus_id_hash: 123_456, item_id: 207_217, slot_index: 5 },
        { bonus_id_hash: 789_012, item_id: 207_280, slot_index: 9 },
      ],
      dps_delta_from_winner: 0,
      mean_dps: 15_250.5,
      rank: 0,
    },
    {
      ci95_half: 52.1,
      diffs: [{ bonus_id_hash: 123_456, item_id: 207_217, slot_index: 5 }],
      dps_delta_from_winner: -375.3,
      mean_dps: 14_875.2,
      rank: 1,
    },
    {
      ci95_half: 61.8,
      diffs: [{ bonus_id_hash: 789_012, item_id: 207_280, slot_index: 9 }],
      dps_delta_from_winner: -1149.7,
      mean_dps: 14_100.8,
      rank: 2,
    },
    {
      ci95_half: 70.5,
      diffs: [],
      dps_delta_from_winner: -3250.5,
      mean_dps: 12_000,
      rank: 3,
    },
  ],
};
