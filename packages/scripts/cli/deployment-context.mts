import { fs } from "zx";

import {
  didBuildApplications,
  listWorkflowRuns,
  resolveDeploymentTarget,
  shouldDeployDevelopmentRun,
} from "../deployment/resolve.ts";

const required = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
};

const event = required("GITHUB_EVENT_NAME");
const repository = required("GITHUB_REPOSITORY");
const output = required("GITHUB_OUTPUT");
const branch =
  event === "workflow_dispatch"
    ? required("GITHUB_REF_NAME")
    : required("DEPLOY_BRANCH");
const sha =
  event === "workflow_dispatch"
    ? required("GITHUB_SHA")
    : required("DEPLOY_SHA");
const target = resolveDeploymentTarget({
  branch,
  event,
  manualTarget: process.env.MANUAL_TARGET,
});

let shouldDeploy = true;

if (event === "workflow_run") {
  const runId = Number.parseInt(required("DEPLOY_RUN_ID"), 10);
  const token = required("GITHUB_TOKEN");

  shouldDeploy = await didBuildApplications({ repository, runId, token });

  if (shouldDeploy && target === "dev") {
    const runs = await listWorkflowRuns({ repository, token });

    shouldDeploy = shouldDeployDevelopmentRun(runId, runs);
  }
}

await fs.appendFile(
  output,
  [
    `branch=${branch}`,
    `sha=${sha}`,
    `target=${target}`,
    `should-deploy=${shouldDeploy.toString()}`,
    "",
  ].join("\n"),
);

console.log(
  shouldDeploy
    ? `Deploying ${sha} from ${branch} to ${target}`
    : `Skipping deployment for ${sha} from ${branch}`,
);
