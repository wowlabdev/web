import { describe, expect, it } from "vitest";

import {
  CreatePreAuthKeySchema,
  ExpirePreAuthKeySchema,
  RenameNodeSchema,
  SetNodeTagsSchema,
} from "./fleet";

describe("fleet request schemas", () => {
  it("normalizes optional pre-auth key fields", () => {
    expect(
      CreatePreAuthKeySchema.parse({
        expiration: "2026-09-01T00:00:00Z",
        userId: "user-1",
      }),
    ).toEqual({
      aclTags: [],
      ephemeral: false,
      expiration: "2026-09-01T00:00:00Z",
      reusable: false,
      userId: "user-1",
    });
  });

  it("validates mutation payloads", () => {
    expect(RenameNodeSchema.parse({ newName: "  worker-1  " })).toEqual({
      newName: "worker-1",
    });
    expect(
      ExpirePreAuthKeySchema.safeParse({ key: "", userId: "user-1" }).success,
    ).toBe(false);
    expect(SetNodeTagsSchema.safeParse({ tags: ["tag:one", 2] }).success).toBe(
      false,
    );
  });
});
