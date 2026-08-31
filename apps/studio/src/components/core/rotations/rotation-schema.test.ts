import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  MALFORMED_ROTATION_JSON,
  VALID_ROTATION_JSON,
} from "./__fixtures__/rotation-schema";
import { parseStoredRotation } from "./rotation-schema";

describe("parseStoredRotation", () => {
  it("parses a stored rotation", () => {
    expect(parseStoredRotation(VALID_ROTATION_JSON)).toEqual(
      VALID_ROTATION_JSON,
    );
  });

  it("rejects malformed nested conditions", () => {
    expect(() => parseStoredRotation(MALFORMED_ROTATION_JSON)).toThrow(
      z.ZodError,
    );
  });
});
