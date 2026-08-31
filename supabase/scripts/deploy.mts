import { $, argv } from "zx";

const FUNCTIONS = new Set(["ai", "icons"]);
const [functionName] = argv._;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const projectRef = process.env.SUPABASE_PROJECT_REF?.trim();

if (!functionName || !FUNCTIONS.has(functionName)) {
  throw new Error("Choose a function to deploy: ai or icons.");
}

if (!accessToken) {
  throw new Error("Set SUPABASE_ACCESS_TOKEN before deploying.");
}

if (!projectRef || !/^[a-z0-9]{20}$/.test(projectRef)) {
  throw new Error("Set SUPABASE_PROJECT_REF to a 20-character project ref.");
}

await $({
  stdio: "inherit",
})`pnpm exec supabase functions deploy ${functionName} --project-ref ${projectRef}`;
