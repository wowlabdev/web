"use client";

import { useIntlayer } from "next-intlayer";
import { Suspense } from "react";

import {
  useBoostBalance,
  useBoostLedger,
  useSubscription,
  useTransactions,
} from "@/lib/query/services";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { makePricingUrl } from "@wowlab/shared/lib/links";

import { BillingBoostSection } from "./billing-boost-section";
import { BillingLedgerTable } from "./billing-ledger-table";
import { BillingSubscriptionSection } from "./billing-subscription-section";
import { BillingSuccessBanner } from "./billing-success-banner";
import { BillingTransactionsTable } from "./billing-transactions-table";

export function BillingPage() {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: boostBalance, isLoading: balanceLoading } = useBoostBalance();
  const { data: ledger, isLoading: ledgerLoading } = useBoostLedger();
  const { data: transactions, isLoading: txnLoading } = useTransactions();
  const content = useIntlayer("accountPage");

  return (
    <section className="py-3">
      <div className="mx-auto max-w-5xl space-y-10">
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <BillingSuccessBanner />
        </Suspense>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              {content.billingPageTitle}
            </h1>
            <p className="text-muted-foreground text-sm">
              {content.billingPageDescription}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={makePricingUrl()}>{content.billingViewPlans}</a>
          </Button>
        </div>

        {subscription?.status === "past_due" && (
          <Alert variant="destructive">
            <AlertTitle>{content.billingPastDueAlertTitle}</AlertTitle>
            <AlertDescription>
              {content.billingPastDueAlertDescription}
            </AlertDescription>
          </Alert>
        )}

        <BillingSubscriptionSection
          isLoading={subLoading}
          subscription={subscription}
        />

        <Separator />

        <BillingBoostSection
          balance={boostBalance}
          isLoading={balanceLoading}
        />

        <Separator />

        <BillingTransactionsTable
          isLoading={txnLoading}
          transactions={transactions}
        />

        <Separator />

        <BillingLedgerTable isLoading={ledgerLoading} ledger={ledger} />
      </div>
    </section>
  );
}
