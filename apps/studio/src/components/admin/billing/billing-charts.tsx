"use client";

import { useIntlayer } from "next-intlayer";

import type { AdminBillingDailyPoint } from "@/lib/paddle/overview";

import { ChartMetricsArea } from "@/components/int/metrics/chart-metrics-area";

type BillingChartsProps = {
  data: AdminBillingDailyPoint[];
};

export function BillingCharts({ data }: Readonly<BillingChartsProps>) {
  const content = useIntlayer("admin");
  const revenueData = data.map((d) => ({
    revenue: d.revenueMinor / 100,
    time: d.date.slice(5),
  }));
  const volumeData = data.map((d) => ({
    failed: d.failed,
    paid: d.paid,
    time: d.date.slice(5),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartMetricsArea
        data={revenueData}
        series={[
          {
            color: "var(--chart-1)",
            key: "revenue",
            label: content.billingPage.chartLabelRevenue.value,
          },
        ]}
        title={content.billingPage.chartRevenueTitle.value}
      />
      <ChartMetricsArea
        data={volumeData}
        series={[
          {
            color: "var(--chart-1)",
            key: "paid",
            label: content.billingPage.chartLabelPaid.value,
          },
          {
            color: "var(--chart-3)",
            key: "failed",
            label: content.billingPage.chartLabelPastDue.value,
          },
        ]}
        title={content.billingPage.chartTransactionsTitle.value}
      />
    </div>
  );
}
