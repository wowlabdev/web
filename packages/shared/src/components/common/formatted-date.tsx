"use client";

import { useDate } from "next-intlayer/format";

export function FormattedDate({
  value,
  ...options
}: {
  value: string | number | Date;
} & Intl.DateTimeFormatOptions) {
  const formatDate = useDate();

  return <>{formatDate(value, options)}</>;
}
