import type { ElementType, ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type SidebarLayoutProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function SidebarLayout({
  as: Component = "div",
  children,
  className,
}: Readonly<SidebarLayoutProps>) {
  return (
    <Component
      className={cn(
        "grid items-start gap-3 lg:grid-cols-[360px_minmax(0,1fr)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
