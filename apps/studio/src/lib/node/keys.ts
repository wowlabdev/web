import { STORAGE_KEYS } from "@/lib/storage/keys";
import { parse, StoredKeypairSchema, tryParseJson } from "@/lib/zod";

type CommonModule = typeof import("wowlab-common");

const STORAGE_KEY = STORAGE_KEYS.nodeKeypair;

export function clearStoredKeypair(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getOrCreateKeypair(common: CommonModule): {
  privateKey: string;
  publicKey: string;
} {
  const existingRaw = localStorage.getItem(STORAGE_KEY);

  if (existingRaw) {
    const existing = parse(StoredKeypairSchema, tryParseJson(existingRaw));

    if (existing) {
      return {
        privateKey: existing.privateKey,
        publicKey: existing.publicKey,
      };
    }

    localStorage.removeItem(STORAGE_KEY);
  }

  const raw = common.generateNodeKeypair();
  const keypair = parse(StoredKeypairSchema, raw);

  if (!keypair) {
    throw new Error(
      `generateNodeKeypair returned bad data: ${JSON.stringify(raw)}`,
    );
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey,
    }),
  );

  return { privateKey: keypair.privateKey, publicKey: keypair.publicKey };
}

export function getPublicKeyBase64(): string | null {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  const parsed = parse(StoredKeypairSchema, tryParseJson(stored));

  return parsed?.publicKey ?? null;
}

export function signRequest(
  common: CommonModule,
  privateKey: string,
  timestamp: string,
  method: string,
  host: string,
  path: string,
  body: string,
): string {
  const message = common.buildSignMessage(
    BigInt(timestamp),
    method,
    host,
    path,
    body,
  );

  if (typeof message !== "string") {
    throw new TypeError(
      `buildSignMessage returned ${typeof message} instead of string. ` +
        `Args: timestamp=${timestamp}, method=${method}, host=${host}, path=${path}, body.length=${body.length}`,
    );
  }

  if (typeof privateKey !== "string") {
    throw new TypeError(`privateKey is ${typeof privateKey} instead of string`);
  }

  return common.signMessage(privateKey, message);
}

export function signRequestBytes(
  common: CommonModule,
  privateKey: string,
  timestamp: string,
  method: string,
  host: string,
  path: string,
  body: Uint8Array,
): string {
  const message = common.buildSignMessageBytes(
    BigInt(timestamp),
    method,
    host,
    path,
    body,
  );

  return common.signMessage(privateKey, message);
}
