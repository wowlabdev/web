import { describe, expect, it } from "vitest";

import { dataPoint, errorQuery } from "../src/schema";

function utf8Length(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError("Expected an Analytics Engine string field");
  }

  return new TextEncoder().encode(value).length;
}

describe("dataPoint", () => {
  it("keeps the fingerprint as the sampling index", () => {
    const point = dataPoint({
      fingerprint: "0123456789abcdef",
      message: "Database failed",
      name: "Error",
      outcome: "exception",
      route: "/pricing",
      script: "wowlab-studio-dev",
      source: "pricing",
      stack: "Error: Database failed",
      version: "wip-dev-studio",
    });

    expect(point.indexes).toEqual(["0123456789abcdef"]);
    expect(point.blobs).toEqual([
      "0123456789abcdef",
      "wowlab-studio-dev",
      "/pricing",
      "Error",
      "Database failed",
      "pricing",
      "",
      "exception",
      "wip-dev-studio",
    ]);
  });

  it("redacts sensitive values before writing exception details", () => {
    const point = dataPoint({
      fingerprint: "0123456789abcdef",
      message:
        "Request for alice@example.com failed at https://api.example.com/users/0123456789abcdef0123456789abcdef?token=super-secret",
      name: "Error",
      outcome: "exception",
      route: "/pricing",
      script: "wowlab-studio-dev",
      source: "pricing",
      stack:
        "Error: token=super-secret\n at request (https://api.example.com/chunks/0123456789abcdef0123456789abcdef.js?token=super-secret:12:4)",
      version: "wip-dev-studio",
    });

    expect(point.blobs?.[4]).toContain("[REDACTED:email]");
    expect(point.blobs?.[4]).toContain("[REDACTED:generic_assignment]");
    expect(point.blobs?.[6]).toBe(
      "request@/chunks/[REDACTED:high_entropy].js:12:4",
    );
    const storedText = point.blobs
      ?.filter((value): value is string => typeof value === "string")
      .join(" ");

    expect(storedText).not.toMatch(
      /alice@example\.com|super-secret|0123456789abcdef0123456789abcdef/u,
    );
  });

  it("redacts identifiers in dynamic routes", () => {
    const point = dataPoint({
      fingerprint: "0123456789abcdef",
      message: "Request failed",
      name: "Error",
      outcome: "exception",
      route:
        "/users/alice@example.com/rotations/550e8400-e29b-41d4-a716-446655440000",
      script: "wowlab-studio-dev",
      source: "handled",
      stack: "",
      version: "wip-dev-studio",
    });

    expect(point.blobs?.[2]).toContain("[REDACTED:");
    expect(point.blobs?.[2]).not.toMatch(
      /alice@example\.com|550e8400-e29b-41d4-a716-446655440000/u,
    );
  });

  it("bounds every field by its UTF-8 byte limit", () => {
    const point = dataPoint({
      fingerprint: "f".repeat(200),
      message: "🔥".repeat(2000),
      name: "n".repeat(1000),
      outcome: "o".repeat(1000),
      route: "r".repeat(1000),
      script: "s".repeat(1000),
      source: "x".repeat(1000),
      stack: "",
      version: "v".repeat(1000),
    });

    expect(utf8Length(point.indexes?.[0])).toBeLessThanOrEqual(96);
    expect(utf8Length(point.blobs?.[4])).toBeLessThanOrEqual(4096);

    for (const [index, value] of point.blobs?.entries() ?? []) {
      if (index !== 4 && index !== 6) {
        expect(utf8Length(value)).toBeLessThanOrEqual(512);
      }
    }
  });
});

describe("errorQuery", () => {
  it("groups changing messages and routes by fingerprint", () => {
    const query = errorQuery("dev", 12, 25);

    expect(query).toContain("FROM wowlab_errors_dev");
    expect(query).toContain("GROUP BY index1");
    expect(query).toContain("argMax(blob5, timestamp) AS message");
    expect(query).toContain("argMax(blob7, timestamp) AS stack");
    expect(query).toContain("INTERVAL '12' HOUR");
    expect(query).toContain("LIMIT 25");
  });
});
