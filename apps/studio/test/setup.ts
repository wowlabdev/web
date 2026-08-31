import { TextDecoder, TextEncoder } from "node:util";
import { vi } from "vitest";

const NodeUint8Array = new TextEncoder().encode("").constructor;

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  Uint8Array: NodeUint8Array,
});

vi.mock("@/lib/observability", () => {
  const log = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    withError: () => log,
    withMetadata: () => log,
  };

  return {
    captureError: vi.fn(),
    log,
  };
});
