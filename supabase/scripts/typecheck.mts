import { $ } from "zx";

await $({
  stdio: "inherit",
})`deno check --frozen-lockfile --config functions/ai/deno.json functions/ai/index.ts functions/ai/governor.test.ts functions/ai/mcp/network-policy.test.ts`;
await $({
  stdio: "inherit",
})`deno check --frozen-lockfile --config functions/icons/deno.json functions/icons/index.ts`;
