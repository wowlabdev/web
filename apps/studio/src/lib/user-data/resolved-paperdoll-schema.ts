import type { ResolvedPaperdoll } from "wowlab-common";

import { type RxJsonSchema } from "rxdb";

export type ResolvedPaperdollDoc = {
  key: string;
  paperdoll: ResolvedPaperdoll;
  resolvedAt: number;
  revision: number;
};

export function resolvedPaperdollSchema(): RxJsonSchema<ResolvedPaperdollDoc> {
  return {
    primaryKey: "key",
    properties: {
      key: { maxLength: 400, type: "string" },
      paperdoll: { type: "object" },
      resolvedAt: { type: "number" },
      revision: { type: "number" },
    },
    required: ["key", "paperdoll", "resolvedAt", "revision"],
    type: "object",
    version: 0,
  };
}
