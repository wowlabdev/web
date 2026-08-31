"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  UsersIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useCurrency } from "next-intlayer/format";

import { useAdminBillingOverview } from "@/lib/query/services";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { PRICE_LABELS } from "@wowlab/shared/lib/billing/constants";

import { BillingCharts } from "./billing-charts";
import { OverviewTabSkeleton } from "./overview-tab-skeleton";

export function OverviewTab() {
  const content = useIntlayer("admin");
  const { data, isLoading } = useAdminBillingOverview();
  const formatCurrency = useCurrency();

  if (isLoading || !data) {
    return <OverviewTabSkeleton />;
  }

  const mrrEntries = Object.entries(
    data.monthlyRecurringRevenueMinorByCurrency,
  );
  const mrrLabel =
    mrrEntries.length === 0
      ? formatCurrency(0, { currency: "USD" })
      : mrrEntries
          .map(([cc, minor]) =>
            formatCurrency(Number(minor) / 100, { currency: cc }),
          )
          .join(" + ");

  const planBreakdown = Object.entries(data.activeSubscriptionsByPlan)
    .map(([priceId, count]) => `${PRICE_LABELS[priceId] ?? priceId}: ${count}`)
    .join(", ");

  const paid30Entries = Object.entries(data.paidRevenueMinor30dByCurrency);
  const paid30Label =
    paid30Entries.length === 0
      ? content.billingPage.chartLabelNoRevenue.value
      : paid30Entries
          .map(([cc, minor]) =>
            formatCurrency(Number(minor) / 100, { currency: cc }),
          )
          .join(" + ");

  const stats = [
    {
      icon: <CreditCardIcon className="size-4" />,
      subtitle: content.billingPage.statMrrSub.value,
      title: content.billingPage.statMrr.value,
      value: mrrLabel,
    },
    {
      icon: <UsersIcon className="size-4" />,
      subtitle: planBreakdown || content.billingPage.statNoBreakdown.value,
      title: content.billingPage.statActiveSubs.value,
      value: String(data.activeSubscriptions),
    },
    {
      icon: <CheckCircle2Icon className="size-4" />,
      subtitle: paid30Label,
      title: content.billingPage.statPaid30d.value,
      value: String(data.paidTransactions30d),
    },
    {
      icon: <AlertTriangleIcon className="size-4" />,
      subtitle: content.billingPage.statLast30Days.value,
      title: content.billingPage.statPastDue30d.value,
      value: String(data.failedTransactions30d),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            changePercentage={stat.subtitle}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <BillingCharts data={data.daily} />
    </div>
  );
}
