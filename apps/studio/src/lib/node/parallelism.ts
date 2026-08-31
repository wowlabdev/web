const DEFAULT_MAX_WORKERS = 8;

export function getAutoWorkerCount(maxWorkers = DEFAULT_MAX_WORKERS): number {
  const cores =
    typeof navigator === "undefined"
      ? 1
      : Math.max(1, navigator.hardwareConcurrency);

  const max = Number.isFinite(maxWorkers)
    ? Math.max(1, Math.floor(maxWorkers))
    : DEFAULT_MAX_WORKERS;

  return Math.max(1, Math.min(cores, max));
}
