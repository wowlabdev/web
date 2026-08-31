"use client";

import { useIntlayer } from "next-intlayer";

export function useNa() {
  const na = useIntlayer("runtimePage").notAvailable.value;

  function orNa<T>(
    value: null | T | undefined,
    format: (value: T) => string = String,
  ): string {
    return value == null ? na : format(value);
  }

  return { na, orNa };
}
