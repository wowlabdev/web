type StableIdPart = bigint | boolean | null | number | string | undefined;

export function stableId(
  scope: string,
  parts: readonly StableIdPart[],
): string {
  return [scope, ...parts.map((part) => formatStableIdPart(part))].join(":");
}

export function stableIndexedId(
  scope: string,
  parts: readonly StableIdPart[],
  index: number,
): string {
  return stableId(scope, [...parts, index]);
}

function formatStableIdPart(part: StableIdPart): string {
  if (part == null) {
    return "_";
  }

  return encodeURIComponent(String(part));
}
