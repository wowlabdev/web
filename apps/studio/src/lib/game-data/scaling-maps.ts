export function getNumberField(row: unknown, key: string): number {
  const value = (row as Record<string, unknown>)[key];

  if (typeof value !== "number") {
    throw new TypeError(`Expected numeric field "${key}"`);
  }

  return value;
}

export function groupRowsByKey<T>(
  rows: T[],
  getKey: (row: T) => number,
): Map<number, T[]> {
  const grouped = new Map<number, T[]>();

  for (const row of rows) {
    const mapKey = getKey(row);
    const existing = grouped.get(mapKey);

    if (existing) {
      existing.push(row);
      continue;
    }

    grouped.set(mapKey, [row]);
  }

  return grouped;
}

export function mapRowsByKey<T>(
  rows: T[],
  getKey: (row: T) => number,
): Map<number, T> {
  const mapped = new Map<number, T>();

  for (const row of rows) {
    mapped.set(getKey(row), row);
  }

  return mapped;
}
