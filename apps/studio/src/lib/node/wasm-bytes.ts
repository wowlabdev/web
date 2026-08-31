const MANIFEST_URL = "/wasm/manifest.json";

type WasmManifest = {
  commonWasm: string;
  engineWasm: string;
};

export async function fetchWasmBytes(): Promise<{
  engineWasm: ArrayBuffer;
  commonWasm: ArrayBuffer;
}> {
  const manifest = await fetchManifest();
  const [engineWasm, commonWasm] = await Promise.all([
    fetchWasm(manifest.engineWasm),
    fetchWasm(manifest.commonWasm),
  ]);

  return { commonWasm, engineWasm };
}

async function fetchManifest(): Promise<WasmManifest> {
  const response = await fetch(MANIFEST_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch wasm manifest ${MANIFEST_URL}: HTTP ${response.status}`,
    );
  }

  const manifest = (await response.json()) as Partial<WasmManifest>;

  if (!manifest.engineWasm || !manifest.commonWasm) {
    throw new Error("Invalid wasm manifest payload");
  }

  return {
    commonWasm: manifest.commonWasm,
    engineWasm: manifest.engineWasm,
  };
}

async function fetchWasm(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch wasm ${url}: HTTP ${response.status}`);
  }

  return response.arrayBuffer();
}
