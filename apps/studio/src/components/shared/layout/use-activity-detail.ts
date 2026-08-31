"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import type { ResolveActivityDetail } from "@/lib/state/resolve-activity-store";

export function useActivityDetail(
  detail: ResolveActivityDetail | null,
): ReactNode {
  const content = useIntlayer("dashboardLayout");

  if (!detail) {
    return null;
  }

  if (detail.kind === "table") {
    return content.activityReading({ table: detail.table });
  }

  return detail.entity === "spell"
    ? content.activityResolvingSpell({ id: detail.id })
    : content.activityResolvingItem({ id: detail.id });
}
