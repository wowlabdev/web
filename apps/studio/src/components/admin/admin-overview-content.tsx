"use client";

import {
  AtSignIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CpuIcon,
  RefreshCcwIcon,
  ServerIcon,
  SwordsIcon,
  UsersIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type {
  useAdminOverview,
  useRecentReservedHandles,
  useSentinelStatus,
} from "@/lib/query/services";

import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { StatCardTrend } from "@wowlab/shared/components/common/stat-card-trend";

import { QuickLinksCard } from "./quick-links-card";
import { RecentHandlesCard } from "./recent-handles-card";

type AdminOverviewContentProps = {
  data: ReturnType<typeof useAdminOverview>["data"];
  isHandlesLoading: boolean;
  recentHandles: ReturnType<typeof useRecentReservedHandles>["data"];
  sentinel: ReturnType<typeof useSentinelStatus>["data"];
};

export function AdminOverviewContent({
  data,
  isHandlesLoading,
  recentHandles,
  sentinel,
}: Readonly<AdminOverviewContentProps>) {
  const content = useIntlayer("admin");

  const primaryStats = [
    {
      icon: <UsersIcon className="size-4" />,
      subtitle: content.overview.registeredProfiles.value,
      title: content.overview.users.value,
      value: String(data?.users ?? 0),
    },
    {
      icon: <CheckCircle2Icon className="size-4" />,
      subtitle: content.overview.submittedSimulations.value,
      title: content.overview.jobs.value,
      value: String(data?.jobs ?? 0),
    },
    {
      icon: <SwordsIcon className="size-4" />,
      subtitle: content.overview.publicPrivate.value,
      title: content.overview.rotations.value,
      value: String(data?.rotations ?? 0),
    },
    {
      icon: <AtSignIcon className="size-4" />,
      subtitle: content.overview.protectedNames.value,
      title: content.overview.reservedHandles.value,
      value: String(data?.reservedHandles ?? 0),
    },
  ];

  const sentinelStats = [
    {
      icon: <CpuIcon className="size-4" />,
      subtitle: content.overview.active.value,
      title: content.overview.chunksRunning.value,
      value: String(sentinel.gauges.chunks_running),
    },
    {
      icon: <RefreshCcwIcon className="size-4" />,
      subtitle: content.overview.queued.value,
      title: content.overview.chunksPending.value,
      value: String(sentinel.gauges.chunks_pending),
    },
    {
      icon: <CalendarIcon className="size-4" />,
      subtitle: content.overview.currentRuleset.value,
      title: content.overview.activeSeason.value,
      value: data?.activeSeasonId ?? "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            changePercentage={stat.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCardTrend
          icon={<ServerIcon className="size-4" />}
          title={content.overview.nodesOnline.value}
          value={String(sentinel.gauges.nodes_online)}
          trend={sentinel.gauges.nodes_online > 0 ? "up" : "down"}
          changePercentage={
            sentinel.gauges.nodes_online > 0
              ? content.overview.active.value
              : content.overview.offline.value
          }
          badgeContent={content.overview.sentinel.value}
        />
        {sentinelStats.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            changePercentage={stat.subtitle}
          />
        ))}
      </div>

      <QuickLinksCard />

      <RecentHandlesCard isLoading={isHandlesLoading} rows={recentHandles} />
    </div>
  );
}
