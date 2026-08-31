import type { ComponentProps } from "react";

import { cn } from "@wowlab/shared/lib/utils";

const CODE_SURFACE =
  "overflow-auto rounded-none bg-muted/50 p-4 font-mono text-sm leading-relaxed";

export function PreCode({
  className,
  ...props
}: Readonly<ComponentProps<"pre">>) {
  return <pre className={cn(CODE_SURFACE, className)} {...props} />;
}
