import type { FieldDescriptorInfo } from "../types";
import type { FieldSort } from "./descriptions";

export function buildDomainList(
  descriptors: FieldDescriptorInfo[],
): { count: number; domain: string }[] {
  const counts = new Map<string, number>();

  for (const d of descriptors) {
    counts.set(d.domain, (counts.get(d.domain) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([domain, count]) => ({ count, domain }));
}

export function groupFieldsByDomain(
  fields: FieldDescriptorInfo[],
  isSearching: boolean,
  sort: FieldSort,
): Map<string, FieldDescriptorInfo[]> {
  const byDomain = new Map<string, FieldDescriptorInfo[]>();

  for (const descriptor of fields) {
    const arr = byDomain.get(descriptor.domain) ?? [];

    arr.push(descriptor);
    byDomain.set(descriptor.domain, arr);
  }

  if (!isSearching) {
    for (const [domain, list] of byDomain) {
      byDomain.set(domain, sortFields(list, sort));
    }
  }

  return byDomain;
}

function sortFields(
  list: FieldDescriptorInfo[],
  sort: FieldSort,
): FieldDescriptorInfo[] {
  return [...list].sort((a, b) => {
    if (sort === "type") {
      const typeCmp = a.field_type.localeCompare(b.field_type);

      if (typeCmp !== 0) {
        return typeCmp;
      }
    }

    return `${a.domain}.${a.name}`.localeCompare(`${b.domain}.${b.name}`);
  });
}
