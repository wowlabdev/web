import { describe, expect, it, vi } from "vitest";

import {
  didBuildApplications,
  listWorkflowRuns,
  resolveDeploymentTarget,
  shouldDeployDevelopmentRun,
  type WorkflowRun,
} from "./resolve.ts";

const jobsResponse = (conclusion: string | null, name = "Run / Build") =>
  Response.json({ jobs: [{ conclusion, name }] });

const github = { repository: "wowlabdev/web", token: "token" };
const workflowRun = { ...github, runId: 42 };
const githubReturning = (response: Response) =>
  vi.fn<typeof fetch>().mockResolvedValue(response);

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

    await expect(
      listWorkflowRuns(
        github,
        githubReturning(Response.json({ workflow_runs: runs })),
      ),
    ).resolves.toEqual(runs);
  });

  it("fails when GitHub rejects the request", async () => {
    await expect(
      listWorkflowRuns(
        github,
        githubReturning(new Response(undefined, { status: 503 })),
      ),
    ).rejects.toThrow("GitHub returned 503");
  });
});

describe("didBuildApplications", () => {
  it("deploys when CI built the applications", async () => {
    await expect(
      didBuildApplications(
        workflowRun,
        githubReturning(jobsResponse("success")),
      ),
    ).resolves.toBe(true);
  });

  it("skips when CI skipped the application build", async () => {
    await expect(
      didBuildApplications(
        workflowRun,
        githubReturning(jobsResponse("skipped")),
      ),
    ).resolves.toBe(false);
  });

  it("fails when the CI run has no application build job", async () => {
    await expect(
      didBuildApplications(
        workflowRun,
        githubReturning(jobsResponse("success", "Run / Validate")),
      ),
    ).rejects.toThrow("CI run 42 has no application build job");
  });

  it("fails when GitHub rejects the request", async () => {
    await expect(
      didBuildApplications(
        workflowRun,
        githubReturning(new Response(undefined, { status: 503 })),
      ),
    ).rejects.toThrow("GitHub returned 503");
  });
});
