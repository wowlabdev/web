"use client";

import {
  BriefcaseIcon,
  CoinsIcon,
  CreditCardIcon,
  PackageIcon,
  SettingsIcon,
  SwordsIcon,
  ZapIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { DashboardPlanCard } from "@/components/account/dashboard-plan-card";
import {
  useAuthUser,
  useBoostBalance,
  useSubscription,
} from "@/lib/query/services";
import { FeatureGrid } from "@wowlab/shared/components/common/feature-grid";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import { type BadgeVariant } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { STATUS_VARIANTS } from "@wowlab/shared/lib/billing/constants";
import { makeBillingUrl } from "@wowlab/shared/lib/links";
import { href } from "@wowlab/shared/lib/routing";
import { routes } from "@wowlab/shared/lib/routing/routes";

type DashboardContentProps = {
  user: ReturnType<typeof useAuthUser>;
  subscription: ReturnType<typeof useSubscription>["data"];
  isSubscriptionLoading: boolean;
  boostBalance: ReturnType<typeof useBoostBalance>["data"];
  isBoostLoading: boolean;
};

export function DashboardContent({
  boostBalance,
  isBoostLoading,
  isSubscriptionLoading,
  subscription,
  user,
}: Readonly<DashboardContentProps>) {
  const content = useIntlayer("accountPage");

  const planKey = subscription?.plan ?? user.subscription.plan;
  const statusKey = subscription?.status ?? user.subscription.status;
  const isSubscribed =
    statusKey === "active" ||
    statusKey === "trialing" ||
    statusKey === "paused";
  const resolvePlanLabel = () => {
    if (planKey === "guild") {
      return content.planLabelGuild.value;
    }

    if (planKey === "individual") {
      return content.planLabelIndividual.value;
    }

    return content.dashboardPlanFree.value;
  };
  const planLabel = resolvePlanLabel();
  const statusVariant: BadgeVariant = STATUS_VARIANTS[statusKey] ?? "outline";

  const balance = boostBalance ?? 0;

  const tools = [
    {
      description: content.dashboardToolQuickDescription.value,
      href: href(routes.simulate.quick),
      icon: <ZapIcon className="size-5" />,
      key: "quick",
      title: content.dashboardToolQuickTitle.value,
    },
    {
      description: content.dashboardToolBagsDescription.value,
      href: href(routes.simulate.bags),
      icon: <BriefcaseIcon className="size-5" />,
      key: "bags",
      title: content.dashboardToolBagsTitle.value,
    },
    {
      description: content.dashboardToolDropsDescription.value,
      href: href(routes.simulate.drops),
      icon: <PackageIcon className="size-5" />,
      key: "drops",
      title: content.dashboardToolDropsTitle.value,
    },
    {
      description: content.dashboardToolRotationsDescription.value,
      href: href(routes.rotations.browse),
      icon: <SwordsIcon className="size-5" />,
      key: "rotations",
      title: content.dashboardToolRotationsTitle.value,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">
              {content.dashboardWelcome({ name: user.name })}
            </h1>
            {user.email && (
              <p className="text-muted-foreground text-sm">{user.email}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={href(routes.simulate.quick)}>
              <ZapIcon className="size-4" />
              {content.dashboardOpenQuickSim}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={makeBillingUrl()}>
              <CreditCardIcon className="size-4" />
              {content.dashboardOpenBilling}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={href(routes.account.settings)}>
              <SettingsIcon className="size-4" />
              {content.dashboardOpenSettings}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isSubscriptionLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <DashboardPlanCard
            planLabel={planLabel}
            planKey={planKey}
            statusKey={statusKey}
            statusVariant={statusVariant}
            quantity={subscription?.quantity ?? null}
            isSubscribed={isSubscribed}
          />
        )}

        {isBoostLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <StatCard
            changePercentage={
              balance > 0
                ? content.dashboardBoostsChangeNeutral.value
                : content.dashboardBoostsChangeZero.value
            }
            icon={<CoinsIcon className="size-4" />}
            title={content.dashboardBoostsTitle.value}
            value={String(balance)}
          />
        )}
      </div>

      <FeatureGrid
        title={content.dashboardJumpBackTitle.value}
        description={content.dashboardJumpBackDescription.value}
        columns={2}
        featuresList={tools}
      />
    </div>
  );
}
