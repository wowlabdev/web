"use client";

import { SwordsIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { StatGrid } from "@/components/shared/layout";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
type RotationViewStatsProps = {
  listCount: number;
  rotation: Row<"rotations">;
  totalActions: number;
};

export function RotationViewStats({
  listCount,
  rotation,
  totalActions,
}: Readonly<RotationViewStatsProps>) {
  const formatDate = useDate();
  const content = useIntlayer("rotations");
  const stats = [
    {
      change: content.statListsCount(listCount).value,
      key: "actions",
      title: content.statTotalActionsTitle.value,
      value: String(totalActions),
    },
    {
      change: content.statVersionUpdated({
        date: formatDate(new Date(rotation.updated_at), {
          dateStyle: "medium",
        }),
      }).value,
      key: "version",
      title: content.statVersionTitle.value,
      value: String(rotation.current_version),
    },
    {
      change: rotation.is_public
        ? content.statVersionPublic.value
        : content.statVersionPrivate.value,
      key: "created",
      title: content.statVersionCreatedTitle.value,
      value: formatDate(new Date(rotation.created_at), {
        dateStyle: "medium",
      }),
    },
  ];

  return (
    <StatGrid>
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          icon={<SwordsIcon className="size-4" />}
          title={stat.title}
          value={stat.value}
          changePercentage={stat.change}
        />
      ))}
    </StatGrid>
  );
}
