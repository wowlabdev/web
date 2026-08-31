import { $ } from "zx";

import type { Application } from "./cloudflare.ts";
import type { DeploymentTarget } from "./resolve.ts";

interface DeploymentMetadata {
  message: string;
  publicEnvironment: {
    NEXT_PUBLIC_DEPLOYMENT_SHA: string;
    NEXT_PUBLIC_DEPLOYMENT_URL: string;
  };
  tag: string;
}

interface DeploymentMetadataOptions {
  app: Application;
  root: string;
  target: DeploymentTarget;
}

interface Source {
  branch: string;
  repository: string;
  runId?: string;
  sha: string;
}

export function createDeploymentMetadata(
  app: Application,
  target: DeploymentTarget,
  source: Source,
): DeploymentMetadata {
  const branch = source.branch.replaceAll(/[^a-zA-Z0-9._-]/g, "-").slice(0, 70);
  const runUrl = source.runId
    ? `https://github.com/${source.repository}/actions/runs/${source.runId}`
    : undefined;

  return {
    message: runUrl ?? `${source.repository}@${source.sha}`,
    publicEnvironment: {
      NEXT_PUBLIC_DEPLOYMENT_SHA: source.sha,
      NEXT_PUBLIC_DEPLOYMENT_URL:
        runUrl ??
        `https://github.com/${source.repository}/commit/${source.sha}`,
    },
    tag: `${branch}-${target}-${app}-${source.sha.slice(0, 12)}`,
  };
}

export async function deploymentMetadata({
  app,
  root,
  target,
}: DeploymentMetadataOptions): Promise<DeploymentMetadata> {
  const git = $({ cwd: root, quiet: true });
  const sha =
    process.env.DEPLOY_SHA ??
    process.env.GITHUB_SHA ??
    (await git`git rev-parse HEAD`).stdout.trim();
  const branch =
    (process.env.DEPLOY_BRANCH ??
      process.env.GITHUB_REF_NAME ??
      (await git`git branch --show-current`).stdout.trim()) ||
    "detached";

  return createDeploymentMetadata(app, target, {
    branch,
    repository: process.env.GITHUB_REPOSITORY ?? "wowlabdev/web",
    runId: process.env.GITHUB_RUN_ID,
    sha,
  });
}
