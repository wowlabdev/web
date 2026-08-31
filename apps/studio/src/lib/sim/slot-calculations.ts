export function computeDpsDeltaPct(
  avgDps: number,
  leaderAvgDps: number,
): number | null {
  if (avgDps <= 0 || leaderAvgDps <= 0 || avgDps === leaderAvgDps) {
    return null;
  }

  return ((avgDps - leaderAvgDps) / leaderAvgDps) * 100;
}

export function computeLikelihoodAlpha(
  hasData: boolean,
  likelihood: number,
  maxLikelihood: number,
  minAlpha = 0.12,
): number {
  if (!hasData) {
    return 0.4;
  }

  return Math.max(minAlpha, likelihood / Math.max(maxLikelihood, 0.01));
}
