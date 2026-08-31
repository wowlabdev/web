import { resolve } from "node:path";

import { createCloudflareCommand } from "../deployment/command.ts";

await createCloudflareCommand(
  resolve(import.meta.dirname, "../../.."),
).parseAsync(process.argv.slice(3), { from: "user" });
