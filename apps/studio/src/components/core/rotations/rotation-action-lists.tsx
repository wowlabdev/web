"use client";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import type { Rotation } from "./rotation-view-types";

import { RotationActionList } from "./rotation-action-list";
import { RotationUnsupportedAlert } from "./rotation-unsupported-alert";
import { useSpecSpellMap } from "./use-spec-spell-map";

type RotationActionListsProps = {
  listNames: string[];
  rotation: Row<"rotations">;
  script: Rotation;
};

export function RotationActionLists({
  listNames,
  rotation,
  script,
}: Readonly<RotationActionListsProps>) {
  const { specMap, supported } = useSpecSpellMap(rotation.spec_id);

  return (
    <>
      {!supported && <RotationUnsupportedAlert />}

      {listNames.map((listName) => (
        <RotationActionList
          key={listName}
          actions={script.lists[listName]}
          listName={listName}
          specMap={specMap}
        />
      ))}
    </>
  );
}
