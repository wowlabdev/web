import { parse } from "jsonc-parser";
import { $, fs, path } from "zx";

interface CloudflareCredentials {
  account: string;
  token: string;
}

export async function cloudflareCredentials(): Promise<CloudflareCredentials> {
  const directory = path.resolve(import.meta.dirname, "..");
  const wrangler = $({ cwd: directory, quiet: true });
  const [configuration, authentication] = await Promise.all([
    fs.readFile(path.join(directory, "wrangler.jsonc"), "utf8"),
    wrangler`pnpm exec wrangler auth token --json`,
  ]);

  return {
    account: accountFromConfig(parse(configuration)),
    token: tokenFromAuth(JSON.parse(authentication.stdout)),
  };
}

function accountFromConfig(value: unknown): string {
  if (!isRecord(value) || typeof value.account_id !== "string") {
    throw new Error("wrangler.jsonc does not define account_id");
  }

  return value.account_id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function tokenFromAuth(value: unknown): string {
  if (!isRecord(value) || typeof value.token !== "string") {
    throw new Error("Wrangler is not logged in; run `wrangler login`");
  }

  return value.token;
}
