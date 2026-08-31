import { fs } from "zx";

import {
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

if (event === "workflow_run" && target === "dev") {
  const runs = await listWorkflowRuns({
    repository,
    token: required("GITHUB_TOKEN"),
  });

  shouldDeploy = shouldDeployDevelopmentRun(
    Number.parseInt(required("DEPLOY_RUN_ID"), 10),
    runs,
  );
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
    : `Skipping stale development run for ${branch}`,
);
