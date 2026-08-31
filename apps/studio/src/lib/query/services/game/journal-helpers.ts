import type { GameRow } from "@wowlab/shared/lib/supabase/types";

import { ItemDropSourcesSchema, parse } from "@/lib/zod";

export type ItemDropScalingRow = Omit<
  GameRow<"item_drop_scaling">,
  "patch_version" | "updated_at"
>;

export function stringifyDropSourceFilter(
  encounterId: number,
  instanceId: number,
) {
  return JSON.stringify(
    parse(
      ItemDropSourcesSchema,
      [
        {
          difficulty_ids: [],
          encounter_id: encounterId,
          encounter_name: "",
          instance_id: instanceId,
          instance_name: "",
        },
      ],
      [],
    ).map(({ encounter_id, instance_id }) => ({ encounter_id, instance_id })),
  );
}
