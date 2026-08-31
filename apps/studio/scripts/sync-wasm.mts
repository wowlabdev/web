import { createHash } from "node:crypto";
import { fs, path } from "zx";

const STUDIO_DIR = path.resolve(import.meta.dirname, "..");
const WASM_DIR = path.join(STUDIO_DIR, "public", "wasm");

const packages = [
  {
    manifestKey: "engineWasm",
    packageName: "wowlab-engine",
    sourceName: "wowlab_engine_bg.wasm",
    targetPrefix: "wowlab_engine_bg",
  },
  {
    manifestKey: "commonWasm",
    packageName: "wowlab-common",
    sourceName: "wowlab_common_bg.wasm",
    targetPrefix: "wowlab_common_bg",
  },
] as const;

fs.mkdirSync(WASM_DIR, { recursive: true });

const existing = fs.readdirSync(WASM_DIR);
const manifest: Record<string, string> = {};

for (const entry of packages) {
  const source = path.join(
    STUDIO_DIR,
    "node_modules",
    entry.packageName,
    entry.sourceName,
  );

  if (!fs.existsSync(source)) {
    throw new Error(`Missing Wasm package output: ${source}`);
  }

  const digest = createHash("sha256")
    .update(fs.readFileSync(source))
    .digest("hex")
    .slice(0, 12);
  const targetName = `${entry.targetPrefix}.${digest}.wasm`;
  const target = path.join(WASM_DIR, targetName);

  fs.copyFileSync(source, target);

  for (const filename of existing) {
    const stale =
      filename.startsWith(`${entry.targetPrefix}.`) &&
      filename.endsWith(".wasm") &&
      filename !== targetName;

    if (stale) {
      fs.rmSync(path.join(WASM_DIR, filename));
    }
  }

  manifest[entry.manifestKey] = `/wasm/${targetName}`;
  console.log(`synced ${entry.sourceName} -> public/wasm/${targetName}`);
}

fs.writeFileSync(
  path.join(WASM_DIR, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
