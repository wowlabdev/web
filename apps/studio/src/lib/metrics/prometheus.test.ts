import { afterEach, describe, expect, it, vi } from "vitest";

import {
  parsePrometheusInstantResponse,
  queryPrometheusRange,
} from "./prometheus";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parsePrometheusInstantResponse", () => {
  it("accepts an instant-vector response", () => {
    const response = {
      data: {
        result: [
          {
            metric: { node_public_key: "node-1" },
            value: [1_725_000_000, "42"],
          },
        ],
      },
      status: "success",
    };

    expect(parsePrometheusInstantResponse(response)).toEqual(response);
  });

  it("rejects malformed samples", () => {
    expect(
      parsePrometheusInstantResponse({
        data: { result: [{ metric: {}, value: ["invalid", 42] }] },
        status: "success",
      }),
    ).toBeNull();
  });
});

describe("queryPrometheusRange", () => {
  it("derives a bounded step from the requested range", async () => {
    const requestedUrls: string[] = [];

    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
      requestedUrls.push(String(input));

      return Promise.resolve(new Response(null));
    });

    await queryPrometheusRange(
      { token: "token", url: "https://metrics.example", user: "user" },
      "sentinel_nodes_online",
      "30d",
    );

    const url = new URL(requestedUrls[0]);

    expect(url.searchParams.get("step")).toBe("21600");
  });
});
