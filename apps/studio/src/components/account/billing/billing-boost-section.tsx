"use client";

import { useIntlayer } from "next-intlayer";

import { BillingBoostBalanceCard } from "./billing-boost-balance-card";

type BillingBoostSectionProps = {
  balance: number | undefined;
  isLoading: boolean;
};

export function BillingBoostSection({
  balance,
  isLoading,
}: Readonly<BillingBoostSectionProps>) {
  const content = useIntlayer("accountPage");

  return (
    <div
      id="tour-account-boosts"
      className="grid grid-cols-1 gap-10 lg:grid-cols-3"
    >
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">{content.billingBoostsTitle}</h3>
        <p className="text-muted-foreground text-sm">
          {content.billingBoostsDescription}
        </p>
      </div>
      <div className="lg:col-span-2">
        <BillingBoostBalanceCard balance={balance} isLoading={isLoading} />
      </div>
    </div>
  );
}
