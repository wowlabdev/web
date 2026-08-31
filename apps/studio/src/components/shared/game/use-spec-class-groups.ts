"use client";

import type { ImplementedSpecInfo } from "wowlab-common";

import { useCreation } from "ahooks";

import type { ClassRow } from "@/lib/game-data";

import { useClassList, useSpecList } from "@/lib/game-data";

import type { SpecClassGroup } from "./spec-picker-types";

export function useSpecClassGroups(
  specs: ImplementedSpecInfo[],
): SpecClassGroup[] {
  const { data: allSpecs } = useSpecList();
  const { data: classes } = useClassList();

  return useCreation(() => {
    const fileNameBySpecId = new Map<number, null | string>();

    for (const spec of allSpecs ?? []) {
      fileNameBySpecId.set(spec.id, spec.file_name);
    }

    const classByName = new Map<string, ClassRow>();

    for (const cls of classes ?? []) {
      classByName.set(cls.name, cls);
    }

    const byClass = new Map<string, SpecClassGroup>();

    for (const spec of specs) {
      let group = byClass.get(spec.class_name);

      if (!group) {
        const cls = classByName.get(spec.class_name);

        group = {
          className: spec.class_name,
          color: cls?.color ?? null,
          iconName: cls?.file_name ?? null,
          specs: [],
        };

        byClass.set(spec.class_name, group);
      }

      group.specs.push({
        fileName: fileNameBySpecId.get(spec.spec_id) ?? null,
        specId: spec.spec_id,
        specName: spec.spec_name,
      });
    }

    const groups = [...byClass.values()].sort((a, b) =>
      a.className.localeCompare(b.className),
    );

    for (const group of groups) {
      group.specs.sort((a, b) => a.specName.localeCompare(b.specName));
    }

    return groups;
  }, [specs, allSpecs, classes]);
}
