"use client";

import { useIntlayer } from "next-intlayer";

import type { ResolveActivityDetail } from "@/lib/state/resolve-activity-store";

import { SystemStatusRow } from "./system-status-row";
import { useActivityDetail } from "./use-activity-detail";

type SystemActivityRowProps = {
  detail: ResolveActivityDetail | null;
  fetched: number;
  isBusy: boolean;
};

export function SystemActivityRow({
  detail,
  fetched,
  isBusy,
}: Readonly<SystemActivityRowProps>) {
  const content = useIntlayer("dashboardLayout");
  const target = useActivityDetail(detail);

  if (!isBusy) {
    return (
      <SystemStatusRow
        label={content.activityLabel}
        tone="muted"
        value={content.activityIdle}
      />
    );
  }

  return (
    <SystemStatusRow
      detail={target ? <span className="font-mono">{target}</span> : null}
      isPulsing
      label={content.activityLabel}
      tone="pending"
      value={
        fetched > 0 ? content.activityFetches(fetched) : content.activityWorking
      }
    />
  );
}
