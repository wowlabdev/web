import type { ReactNode } from "react";

import { Badge, type BadgeVariant } from "@wowlab/shared/components/ui/badge";

type MdBadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function MdBadge({
  children,
  variant = "secondary",
}: Readonly<MdBadgeProps>) {
  return <Badge variant={variant}>{children}</Badge>;
}
