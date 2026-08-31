import { fingerprintException } from "@wowlab/shared/lib/observability/fingerprint";
import { describe, expect, it } from "vitest";

describe("fingerprintException", () => {
  it("ignores deployment line numbers and request identifiers", () => {
    const first = fingerprintException({
      message: "Request 018d6f6e-7242-7b7d-8785-9f9f6f8f66f1 failed",
      name: "Error",
      source: "pricing",
      stack: "Error\n at query (server-a1b2c3d4e5f67890.js:12:4)",
    });
    const second = fingerprintException({
      message: "Request 118d6f6e-7242-7b7d-8785-9f9f6f8f66f2 failed",
      name: "Error",
      source: "pricing",
      stack: "Error\n at query (server-b1b2c3d4e5f67890.js:98:7)",
    });

    expect(first).toBe(second);
  });

  it("keeps unrelated failures separate", () => {
    const database = fingerprintException({
      message: "Database unavailable",
      name: "Error",
      source: "pricing",
    });
    const authentication = fingerprintException({
      message: "Authentication failed",
      name: "Error",
      source: "pricing",
    });

    expect(database).not.toBe(authentication);
  });
});
