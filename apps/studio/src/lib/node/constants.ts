import type { BadgeVariant } from "@wowlab/shared/components/ui/badge";

export const WORKER_STATE_VARIANTS: Record<string, BadgeVariant> = {
  busy: "default",
  error: "destructive",
  idle: "secondary",
  initializing: "outline",
  ready: "default",
  terminated: "destructive",
};
