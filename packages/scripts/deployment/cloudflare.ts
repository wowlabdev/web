import { $, path } from "zx";

import type { DeploymentTarget } from "./resolve.ts";

import { loadPublicEnvironment, wranglerVariables } from "./environment.ts";
import { deploymentMetadata } from "./metadata.ts";

export const APPLICATIONS = ["landing", "og", "studio", "tail"] as const;
export const TARGETS = ["dev", "prod"] as const;

export type Application = (typeof APPLICATIONS)[number];

const adapters: Record<Application, "open-next" | "wrangler"> = {
  landing: "open-next",
  og: "wrangler",
  studio: "open-next",
  tail: "wrangler",
};

export interface DeployOptions {
  app: Application;
  dryRun: boolean;
  root: string;
  target: DeploymentTarget;
}

export async function deployCloudflare({
  app,
  dryRun,
  root,
  target,
}: DeployOptions): Promise<void> {
  const directory = path.join(root, "apps", app);
  const metadata = await deploymentMetadata({ app, root, target });
  const environment = target === "dev" ? ["--env", "dev"] : [];
  const dryRunFlag = dryRun ? ["--dry-run"] : [];

  if (adapters[app] === "wrangler") {
    await $({
      cwd: directory,
    })`pnpm exec wrangler deploy ${environment} --tag ${metadata.tag} --message ${metadata.message} ${dryRunFlag}`;

    return;
  }

  const environmentFile =
    target === "dev" ? ".env.cloudflare.dev" : ".env.cloudflare";
  const publicEnvironment = await loadPublicEnvironment(
    path.join(directory, environmentFile),
  );
  const variables = wranglerVariables(publicEnvironment);
  const run = $({
    cwd: directory,
    env: {
      ...process.env,
      ...publicEnvironment,
      ...metadata.publicEnvironment,
      CF_DEPLOY_ID: `dpl-${Date.now().toString(36)}`,
    },
  });

  const buildScript = target === "dev" ? "cf:build:dev" : "cf:build";

  await run`pnpm ${buildScript}`;
  await run`pnpm exec opennextjs-cloudflare deploy ${environment} -- --tag ${metadata.tag} --message ${metadata.message} ${variables} ${dryRunFlag}`;
}
