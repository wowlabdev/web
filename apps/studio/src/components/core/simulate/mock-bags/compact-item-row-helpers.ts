export function resolveBarClass(
  isWinner: boolean,
  isEliminated: boolean,
): string {
  if (isWinner) {
    return "bg-green-500";
  }

  if (isEliminated) {
    return "bg-muted-foreground/20";
  }

  return "bg-primary/50";
}

export function resolveItemNameClass(
  isEliminated: boolean,
  isWinner: boolean,
  qualityClass: string,
): string {
  if (isEliminated) {
    return "text-muted-foreground line-through";
  }

  if (isWinner) {
    return "text-green-400";
  }

  return qualityClass;
}

export function resolvePctClass(isWinner: boolean, pct: number): string {
  if (isWinner) {
    return "text-green-400";
  }

  if (pct >= 50) {
    return "text-foreground";
  }

  return "text-muted-foreground/50";
}

export function resolveSparkColor(
  isWinner: boolean,
  isEliminated: boolean,
): string {
  if (isWinner) {
    return "#22c55e";
  }

  if (isEliminated) {
    return "#888";
  }

  return "var(--color-primary)";
}
