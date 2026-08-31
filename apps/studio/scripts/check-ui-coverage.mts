import type { Dirent } from "node:fs";

import { fs, path } from "zx";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const UI_DIR = path.join(ROOT, "packages/shared/src/components/ui");
const SCAN_TARGETS = [
  "apps/studio/src/app/[locale]/(shell)/int/ui/_components",
  "apps/studio/src/components/shared/layout",
  "apps/studio/src/app/[locale]/layout.tsx",
].map((target) => path.join(ROOT, target));

function readSource(target: string): string {
  if (!fs.existsSync(target)) {
    return "";
  }

  if (fs.statSync(target).isFile()) {
    return fs.readFileSync(target, "utf8");
  }

  const entries = fs.readdirSync(target, {
    withFileTypes: true,
  }) as Dirent[];

  return entries
    .filter(
      (entry) =>
        entry.isDirectory() ||
        entry.name.endsWith(".ts") ||
        entry.name.endsWith(".tsx"),
    )
    .map((entry) => readSource(path.join(target, entry.name)))
    .join("\n");
}

const source = SCAN_TARGETS.map((target) => readSource(target)).join("\n");
const filenames = fs.readdirSync(UI_DIR) as string[];
const missing = filenames
  .filter((filename) => filename.endsWith(".tsx"))
  .map((filename) => filename.slice(0, -4))
  .filter((component) => !source.includes(`components/ui/${component}"`));

if (missing.length > 0) {
  const files = missing
    .map((name) => `  - components/ui/${name}.tsx`)
    .join("\n");

  throw new Error(
    `UI showcase is missing ${missing.length} component(s):\n${files}`,
  );
}

console.log("Every shared UI component is covered by the Studio showcase.");
