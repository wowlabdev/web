export function normalizeProtobufBytes(input: unknown): Uint8Array {
  if (input instanceof Uint8Array) {
    return input;
  }

  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }

  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }

  if (isByteArray(input)) {
    return Uint8Array.from(input);
  }

  if (
    input &&
    typeof input === "object" &&
    "bytes" in input &&
    input.bytes != null
  ) {
    return normalizeProtobufBytes(input.bytes);
  }

  throw new Error(
    `Unsupported protobuf payload type: ${Object.prototype.toString.call(input)}`,
  );
}

function isByteArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) => Number.isInteger(entry) && entry >= 0 && entry <= 255,
    )
  );
}
