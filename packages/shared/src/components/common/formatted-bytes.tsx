"use client";

import prettyBytes, { type Options } from "pretty-bytes";

export function FormattedBytes({
  value,
  ...options
}: {
  value: number;
} & Options) {
  return <>{prettyBytes(value, options)}</>;
}
