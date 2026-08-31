export function dedupeSortIds(ids: number[]): number[] {
  return [...new Set(ids)].sort((a, b) => a - b);
}
