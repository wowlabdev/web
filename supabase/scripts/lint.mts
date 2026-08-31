import { $, argv } from "zx";

const arguments_ = argv.fix ? ["--fix"] : [];

await $({ stdio: "inherit" })`eslint . ${arguments_}`;
await $({
  stdio: "inherit",
})`deno lint --config functions/ai/deno.json functions/ai functions/_shared ${arguments_}`;
await $({
  stdio: "inherit",
})`deno lint --config functions/icons/deno.json functions/icons ${arguments_}`;
