import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type SidebarSectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SidebarSectionLabel({
  children,
  className,
}: Readonly<SidebarSectionLabelProps>) {
  return (
    <h4
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3",
        className,
      )}
    >
      {children}
    </h4>
  );
}
