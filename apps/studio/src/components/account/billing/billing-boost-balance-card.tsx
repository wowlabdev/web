"use client";

import { CoinsIcon, PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import Link from "next/link";

import {
  Skeleton,
  SkeletonCard,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { Button } from "@wowlab/shared/components/ui/button";
import { MIN_BOOSTS } from "@wowlab/shared/lib/billing/constants";
import { env } from "@wowlab/shared/lib/env";
import { makeCheckoutUrl } from "@wowlab/shared/lib/links";

type BillingBoostBalanceCardProps = {
  balance: number | undefined;
  isLoading: boolean;
};

export function BillingBoostBalanceCard({
  balance,
  isLoading,
}: Readonly<BillingBoostBalanceCardProps>) {
  const content = useIntlayer("accountPage");

  if (isLoading) {
    return <BillingBoostBalanceSkeleton />;
  }

  const topUpUrl = makeCheckoutUrl({
    priceId: env.PADDLE_PRICE_BOOST_PACK,
    quantity: MIN_BOOSTS,
  });

  return (
    <StatCard
      action={
        <Button asChild size="sm" variant="outline">
          <Link href={topUpUrl}>
            <PlusIcon className="size-4" />
            {content.billingTopUpBoosts}
          </Link>
        </Button>
      }
      changePercentage=""
      icon={<CoinsIcon className="size-4" />}
      title={content.billingBoostBalanceTitle.value}
      value={String(balance ?? 0)}
    />
  );
}

function BillingBoostBalanceSkeleton() {
  return (
    <SkeletonCard className="gap-4" headerWidth="w-40">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </SkeletonCard>
  );
}
