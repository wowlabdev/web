import { Argument, Command } from "commander";

import type { DeploymentTarget } from "./resolve.ts";

import {
  type Application,
  APPLICATIONS,
  deployCloudflare,
  type DeployOptions,
  TARGETS,
} from "./cloudflare.ts";

type Deploy = (options: DeployOptions) => Promise<void>;

export function createCloudflareCommand(
  root: string,
  deploy: Deploy = deployCloudflare,
): Command {
  const command = new Command()
    .name("deploy-cloudflare")
    .description("Build and deploy a Cloudflare application.")
    .addArgument(new Argument("<app>", "application").choices(APPLICATIONS))
    .addArgument(new Argument("<target>", "environment").choices(TARGETS))
    .option("--dry-run", "build without uploading", false)
    .action((app: Application, target: DeploymentTarget) => {
      const { dryRun } = command.opts<{ dryRun: boolean }>();

      return deploy({ app, dryRun, root, target });
    });

  return command;
}
