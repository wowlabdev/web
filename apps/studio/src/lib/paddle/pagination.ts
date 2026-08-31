import "server-only";

export function clampPerPage(raw: string | null, def = 50, max = 200): number {
  if (!raw) {
    return def;
  }

  const n = Number(raw);

  if (!Number.isFinite(n) || n <= 0) {
    return def;
  }

  return Math.min(Math.floor(n), max);
}

export async function collectAll<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];

  for await (const item of iterable) {
    out.push(item);
  }

  return out;
}
