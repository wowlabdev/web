import type { useSimcParser } from "@/components/core/simulate/use-simc-parser";

export type FormatNumber = (
  n: number,
  opts?: Intl.NumberFormatOptions,
) => string;

export type Profile = NonNullable<ReturnType<typeof useSimcParser>["profile"]>;

export const compactNumber = (fmtNumber: FormatNumber, n: number): string =>
  fmtNumber(n, { maximumFractionDigits: 1, notation: "compact" });

export const integerNumber = (fmtNumber: FormatNumber, n: number): string =>
  fmtNumber(n, { maximumFractionDigits: 0 });

export const createFormatters = (fmtNumber: FormatNumber) => ({
  compact: (n: number) => compactNumber(fmtNumber, n),
  integer: (n: number) => integerNumber(fmtNumber, n),
});
