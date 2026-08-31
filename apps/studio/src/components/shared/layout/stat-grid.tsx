import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type StatGridProps = {
  children: ReactNode;
  className?: string;
};

export function StatGrid({ children, className }: Readonly<StatGridProps>) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}
