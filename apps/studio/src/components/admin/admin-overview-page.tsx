"use client";

import {
  useAdminOverview,
  useRecentReservedHandles,
  useSentinelStatus,
} from "@/lib/query/services";

import { AdminOverviewContent } from "./admin-overview-content";
import { AdminOverviewSkeleton } from "./admin-overview-skeleton";

export function AdminOverviewPage() {
  const { data, isLoading } = useAdminOverview();
  const { data: recentHandles, isLoading: isHandlesLoading } =
    useRecentReservedHandles();
  const { data: sentinel } = useSentinelStatus();

  if (isLoading) {
    return <AdminOverviewSkeleton />;
  }

  return (
    <AdminOverviewContent
      data={data}
      isHandlesLoading={isHandlesLoading}
      recentHandles={recentHandles}
      sentinel={sentinel}
    />
  );
}
