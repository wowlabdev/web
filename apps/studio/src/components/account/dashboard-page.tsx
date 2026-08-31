"use client";

import { DashboardContent } from "@/components/account/dashboard-content";
import {
  useAuthUser,
  useBoostBalance,
  useSubscription,
} from "@/lib/query/services";

export function DashboardPage() {
  const user = useAuthUser();
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useSubscription();
  const { data: boostBalance, isLoading: isBoostLoading } = useBoostBalance();

  return (
    <DashboardContent
      user={user}
      subscription={subscription}
      isSubscriptionLoading={isSubscriptionLoading}
      boostBalance={boostBalance}
      isBoostLoading={isBoostLoading}
    />
  );
}
