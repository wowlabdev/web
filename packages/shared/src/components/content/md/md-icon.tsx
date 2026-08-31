import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type MdIconProps = {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
};

const SIZE_CLASSES = {
  lg: "[&>svg]:size-6",
  md: "[&>svg]:size-5",
  sm: "[&>svg]:size-4",
  xl: "[&>svg]:size-8",
  xs: "[&>svg]:size-3",
};

export function MdIcon({ children, size = "md" }: Readonly<MdIconProps>) {
  return (
    <span className={cn("inline-flex items-center", SIZE_CLASSES[size])}>
      {children}
    </span>
  );
}
