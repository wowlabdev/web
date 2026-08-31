export type DeploymentTarget = "dev" | "prod";

export interface WorkflowRun {
  conclusion: string | null;
  created_at: string;
  event: string;
  head_branch: string;
  id: number;
}

interface GitHubWorkflowOptions {
  repository: string;
  token: string;
}

interface GitHubWorkflowRunOptions extends GitHubWorkflowOptions {
  runId: number;
}

interface ResolveDeploymentTargetOptions {
  branch: string;
  event: string;
  manualTarget?: string;
}

interface WorkflowJob {
  conclusion: string | null;
  name: string;
}

interface WorkflowJobs {
  jobs: WorkflowJob[];
}

interface WorkflowRuns {
  workflow_runs: WorkflowRun[];
}

const APPLICATION_BUILD_JOB = "Run / Build";

export async function didBuildApplications(
  { repository, runId, token }: GitHubWorkflowRunOptions,
  request: typeof fetch = fetch,
): Promise<boolean> {
  const response = await request(
    `https://api.github.com/repos/${repository}/actions/runs/${runId.toString()}/jobs?filter=latest&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2026-03-10",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while listing CI jobs`);
  }

  const { jobs } = (await response.json()) as WorkflowJobs;
  const build = jobs.find(({ name }) => name === APPLICATION_BUILD_JOB);

  if (!build) {
    throw new Error(`CI run ${runId.toString()} has no application build job`);
  }

  return build.conclusion === "success";
}

export async function listWorkflowRuns(
  { repository, token }: GitHubWorkflowOptions,
  request: typeof fetch = fetch,
): Promise<WorkflowRun[]> {
  const response = await request(
    `https://api.github.com/repos/${repository}/actions/workflows/ci.yml/runs?event=push&status=success&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2026-03-10",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while listing CI runs`);
  }

  const { workflow_runs: runs } = (await response.json()) as WorkflowRuns;

  return runs;
}

export function resolveDeploymentTarget({
  branch,
  event,
  manualTarget,
}: ResolveDeploymentTargetOptions): DeploymentTarget {
  let target = manualTarget;

  if (event !== "workflow_dispatch") {
    target = branch === "main" ? "prod" : "dev";
  }

  if (target !== "dev" && target !== "prod") {
    throw new Error(`Unsupported deployment target: ${target ?? "missing"}`);
  }

  if (target === "prod" && branch !== "main") {
    throw new Error("Production deployments must use main");
  }

  return target;
}

export function shouldDeployDevelopmentRun(
  currentRun: number,
  runs: WorkflowRun[],
): boolean {
  const latest = runs
    .filter(
      (run) =>
        run.conclusion === "success" &&
        run.event === "push" &&
        run.head_branch !== "main",
    )
    .toSorted((left, right) =>
      right.created_at.localeCompare(left.created_at),
    )[0];

  return latest?.id === currentRun;
}
