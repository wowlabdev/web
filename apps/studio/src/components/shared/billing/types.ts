import type { ReactNode } from "react";

export type Column<T> = {
  cell: (row: T) => ReactNode;
  className?: string;
  header: string;
};
