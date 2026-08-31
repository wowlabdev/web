import { describe, expect, it } from "vitest";

import { collectExceptions } from "../src/collect";

function trace(overrides: Partial<TraceItem> = {}): TraceItem {
  return {
    cpuTime: 0,
    diagnosticsChannelEvents: [],
    event: {
      request: {
        cf: {},
        getUnredacted: () => {
          throw new Error("not used");
        },
        headers: {},
        method: "GET",
        url: "https://app.dev.wowlab.gg/pricing?token=secret",
      },
      response: { status: 500 },
    },
    eventTimestamp: Date.now(),
    exceptions: [],
    executionModel: "stateless",
    logs: [],
    outcome: "ok",
    scriptName: "wowlab-studio-dev",
    truncated: false,
    wallTime: 0,
    ...overrides,
  };
}

describe("collectExceptions", () => {
  it("collects structured LogLayer errors", () => {
    const [result] = collectExceptions(
      trace({
        logs: [
          {
            level: "error",
            message: [
              {
                err: {
                  message: "Database failed",
                  name: "Error",
                  stack: "Error: Database failed\n at query (db.ts:12:4)",
                },
                errorFingerprint: "0123456789abcdef",
                errorMessage: "Database failed",
                errorName: "Error",
                eventType: "exception",
                message: "Request failed",
                source: "pricing",
              },
            ],
            timestamp: Date.now(),
          },
        ],
      }),
    );

    expect(result).toMatchObject({
      fingerprint: "0123456789abcdef",
      message: "Database failed",
      route: "/pricing",
      script: "wowlab-studio-dev",
      source: "pricing",
    });
  });

  it("collects uncaught exceptions", () => {
    const [result] = collectExceptions(
      trace({
        exceptions: [
          {
            message: "Worker failed",
            name: "TypeError",
            stack: "TypeError: Worker failed\n at handler (worker.ts:9:2)",
            timestamp: Date.now(),
          },
        ],
        outcome: "exception",
      }),
    );

    expect(result).toMatchObject({
      message: "Worker failed",
      name: "TypeError",
      outcome: "exception",
      route: "/pricing",
      source: "uncaught",
    });
    expect(result?.fingerprint).toMatch(/^[\da-f]{16}$/u);
  });

  it("collects handled LogLayer errors without capture metadata", () => {
    const [result] = collectExceptions(
      trace({
        logs: [
          {
            level: "error",
            message: [
              {
                err: {
                  message: "Paddle request failed",
                  name: "Error",
                  stack:
                    "Error: Paddle request failed\n at request (paddle.ts:8:2)",
                },
                message: "Unable to load transaction",
              },
            ],
            timestamp: Date.now(),
          },
        ],
      }),
    );

    expect(result).toMatchObject({
      message: "Paddle request failed",
      name: "Error",
      route: "/pricing",
      source: "handled",
    });
    expect(result?.fingerprint).toMatch(/^[\da-f]{16}$/u);
  });

  it("ignores ordinary console output", () => {
    const result = collectExceptions(
      trace({
        logs: [
          {
            level: "info",
            message: ["request complete"],
            timestamp: Date.now(),
          },
        ],
      }),
    );

    expect(result).toEqual([]);
  });

  it("ignores error-shaped metadata below error level", () => {
    const result = collectExceptions(
      trace({
        logs: [
          {
            level: "info",
            message: [
              {
                err: { message: "Expected", name: "Error" },
                message: "Request retry",
              },
            ],
            timestamp: Date.now(),
          },
        ],
      }),
    );

    expect(result).toEqual([]);
  });
});
