const DEFAULT_THRESHOLD = 8000;
const PREVIEW_CHARS = 1500;
const DEFAULT_READ_LIMIT = 4000;

export type MaybeStoreResult =
  | { inline: unknown }
  | { bufferId: string; preview: string; totalChars: number };

export class ToolResultBuffer {
  private counter = 0;
  private readonly entries = new Map<string, string>();

  constructor(private readonly threshold: number = DEFAULT_THRESHOLD) {}

  maybeStore(value: unknown): MaybeStoreResult {
    const serialized =
      typeof value === "string" ? value : (JSON.stringify(value) ?? "null");

    if (serialized.length <= this.threshold) {
      return { inline: value };
    }

    this.counter += 1;
    const bufferId = `buffer_${this.counter}`;

    this.entries.set(bufferId, serialized);

    return {
      bufferId,
      preview: serialized.slice(0, PREVIEW_CHARS),
      totalChars: serialized.length,
    };
  }

  read(bufferId: string, offset = 0, limit = DEFAULT_READ_LIMIT): string {
    const content = this.entries.get(bufferId);

    if (content === undefined) {
      const available = [...this.entries.keys()].join(", ") || "none";

      return `Buffer "${bufferId}" not found. Available buffers: ${available}`;
    }

    const start = Number.isFinite(offset) ? Math.max(0, Math.trunc(offset)) : 0;
    const pageSize = Number.isFinite(limit)
      ? Math.min(DEFAULT_READ_LIMIT, Math.max(1, Math.trunc(limit)))
      : DEFAULT_READ_LIMIT;
    const slice = content.slice(start, start + pageSize);
    const remaining = Math.max(0, content.length - start - slice.length);

    if (remaining > 0) {
      return `${slice}\n\n[${remaining} more chars available. Use offset=${
        start + slice.length
      } to continue reading.]`;
    }

    return slice;
  }
}
