import { describe, expect, it, vi } from "vitest";

import { createCloudflareCommand } from "./command.ts";

describe("Cloudflare command", () => {
  it("passes user arguments to the deployer", async () => {
    const deploy = vi.fn(() => Promise.resolve());
    const command = createCloudflareCommand("/workspace", deploy);

    await command.parseAsync(["studio", "dev"], { from: "user" });

    expect(deploy).toHaveBeenCalledExactlyOnceWith({
      app: "studio",
      dryRun: false,
      root: "/workspace",
      target: "dev",
    });
  });

  it("passes dry runs to the deployer", async () => {
    const deploy = vi.fn(() => Promise.resolve());
    const command = createCloudflareCommand("/workspace", deploy);

    await command.parseAsync(["og", "prod", "--dry-run"], { from: "user" });

    expect(deploy).toHaveBeenCalledExactlyOnceWith({
      app: "og",
      dryRun: true,
      root: "/workspace",
      target: "prod",
    });
  });
});
