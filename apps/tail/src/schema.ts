import type { ExceptionRecord } from "#types";

import { redactExceptionStack, redactSensitiveText } from "#redact";

export const DATASETS = {
  dev: "wowlab_errors_dev",
  prod: "wowlab_errors",
} as const;

export type DatasetTarget = keyof typeof DATASETS;

const MAX_DETAIL_BYTES = 4096;
const MAX_DIMENSION_BYTES = 512;
const MAX_INDEX_BYTES = 96;
const decoder = new TextDecoder();
const encoder = new TextEncoder();

export function dataPoint(record: ExceptionRecord): AnalyticsEngineDataPoint {
  return {
    blobs: [
      bytes(record.fingerprint, MAX_INDEX_BYTES),
      bytes(record.script, MAX_DIMENSION_BYTES),
      bytes(redactSensitiveText(record.route), MAX_DIMENSION_BYTES),
      bytes(record.name, MAX_DIMENSION_BYTES),
      bytes(redactSensitiveText(record.message), MAX_DETAIL_BYTES),
      bytes(record.source, MAX_DIMENSION_BYTES),
      bytes(redactExceptionStack(record.stack), MAX_DETAIL_BYTES),
      bytes(record.outcome, MAX_DIMENSION_BYTES),
      bytes(record.version, MAX_DIMENSION_BYTES),
    ],
    doubles: [1],
    indexes: [bytes(record.fingerprint, MAX_INDEX_BYTES)],
  };
}

export function errorQuery(
  target: DatasetTarget,
  hours: number,
  limit: number,
): string {
  return `SELECT
  SUM(_sample_interval) AS count,
  index1 AS fingerprint,
  argMax(blob2, timestamp) AS worker,
  argMax(blob3, timestamp) AS route,
  argMax(blob4, timestamp) AS error,
  argMax(blob5, timestamp) AS message,
  argMax(blob6, timestamp) AS source,
  argMax(blob7, timestamp) AS stack,
  argMax(blob8, timestamp) AS outcome,
  argMax(blob9, timestamp) AS version,
  MAX(timestamp) AS last_seen
FROM ${DATASETS[target]}
WHERE timestamp > NOW() - INTERVAL '${hours}' HOUR
GROUP BY index1
ORDER BY count DESC, last_seen DESC
LIMIT ${limit}
FORMAT JSON`;
}

function bytes(value: string, maximum: number): string {
  const encoded = encoder.encode(value);

  if (encoded.length <= maximum) {
    return value;
  }

  let end = maximum;

  while (end > 0 && (encoded[end] & 0xc0) === 0x80) {
    end -= 1;
  }

  return decoder.decode(encoded.subarray(0, end));
}
