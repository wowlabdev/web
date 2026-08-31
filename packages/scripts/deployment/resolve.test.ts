import { describe, expect, it, vi } from "vitest";

import {
  listWorkflowRuns,
  resolveDeploymentTarget,
  shouldDeployDevelopmentRun,
  type WorkflowRun,
} from "./resolve.ts";

const run = (overrides: Partial<WorkflowRun> = {}): WorkflowRun => ({
  conclusion: "success",
  created_at: "2026-08-31T01:00:00Z",
  event: "push",
  head_branch: "wip",
  id: 1,
  ...overrides,
});

describe("resolveDeploymentTarget", () => {
  it("uses dev for a manual development deployment", () => {
    expect(
      resolveDeploymentTarget({
        branch: "wip",
        event: "workflow_dispatch",
        manualTarget: "dev",
      }),
    ).toBe("dev");
  });

  it("uses prod for a manual main deployment", () => {
    expect(
      resolveDeploymentTarget({
        branch: "main",
        event: "workflow_dispatch",
        manualTarget: "prod",
      }),
    ).toBe("prod");
  });

  it("rejects production from another branch", () => {
    expect(() =>
      resolveDeploymentTarget({
        branch: "wip",
        event: "workflow_dispatch",
        manualTarget: "prod",
      }),
    ).toThrow("Production deployments must use main");
  });
});

describe("shouldDeployDevelopmentRun", () => {
  it("selects the newest successful non-main push", () => {
    const runs = [
      run({ created_at: "2026-08-31T02:00:00Z", id: 2 }),
      run({ id: 1 }),
      run({ created_at: "2026-08-31T03:00:00Z", head_branch: "main", id: 3 }),
    ];

    expect(shouldDeployDevelopmentRun(2, runs)).toBe(true);
  });

  it("skips a stale run", () => {
    expect(
      shouldDeployDevelopmentRun(1, [
        run({ created_at: "2026-08-31T02:00:00Z", id: 2 }),
        run({ id: 1 }),
      ]),
    ).toBe(false);
  });

  it("skips when no successful development run exists", () => {
    expect(
      shouldDeployDevelopmentRun(1, [
        run({ conclusion: "failure" }),
        run({ head_branch: "main", id: 2 }),
      ]),
    ).toBe(false);
  });
});

describe("listWorkflowRuns", () => {
  it("returns workflow runs from GitHub", async () => {
    const runs = [run()];
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ workflow_runs: runs }));

    await expect(
      listWorkflowRuns(
        { repository: "wowlabdev/web", token: "token" },
        request,
      ),
    ).resolves.toEqual(runs);
  });

  it("fails when GitHub rejects the request", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(undefined, { status: 503 }));

    await expect(
      listWorkflowRuns(
        { repository: "wowlabdev/web", token: "token" },
        request,
      ),
    ).rejects.toThrow("GitHub returned 503");
  });
});
