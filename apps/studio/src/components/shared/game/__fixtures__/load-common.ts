import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import * as common from "wowlab-common";

let initialized = false;

// Init wasm off disk (no browser); getCommon/getEngine throw off-browser so can't be reused.
export function loadCommon(): typeof common {
  if (!initialized) {
    const require = createRequire(import.meta.url);
    const entry = require.resolve("wowlab-common");
    const wasmBytes = readFileSync(
      path.join(path.dirname(entry), "wowlab_common_bg.wasm"),
    );

    common.initSync({ module: wasmBytes });
    initialized = true;
  }

  return common;
}
