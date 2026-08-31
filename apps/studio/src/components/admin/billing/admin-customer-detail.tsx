"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import { useAdminCustomer } from "@/lib/query/services";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { AdminCancelSubDialog } from "./admin-cancel-sub-dialog";
import { AdminChangeSlotsDialog } from "./admin-change-slots-dialog";
import { AdminPauseSubDialog } from "./admin-pause-sub-dialog";
import { AdminResumeSubDialog } from "./admin-resume-sub-dialog";
import { AdminSubscriptionCard } from "./admin-subscription-card";
import { RefundDialog } from "./refund-dialog";
import { useAdjustmentColumns } from "./use-adjustment-columns";
import { useAdminTransactionColumns } from "./use-admin-transaction-columns";
import { useCustomerDialogs } from "./use-customer-dialogs";
import { useLedgerColumns } from "./use-ledger-columns";

type AdminCustomerDetailProps = {
  customerId: string;
};

export function AdminCustomerDetail({
  customerId,
}: Readonly<AdminCustomerDetailProps>) {
  const content = useIntlayer("admin");
  const formatDate = useDate();
  const { data, isLoading } = useAdminCustomer(customerId);

  const {
    activeSubscription,
    cancelOpen,
    handleCancel,
    handleChangeSlots,
    handlePause,
    handleRefund,
    handleResume,
    pauseOpen,
    refundOpen,
    refundTarget,
    resumeOpen,
    setCancelOpen,
    setPauseOpen,
    setRefundOpen,
    setResumeOpen,
    setSlotsOpen,
    slotsOpen,
  } = useCustomerDialogs();

  const transactionColumns = useAdminTransactionColumns({
    onRefund: handleRefund,
    shouldShowCustomer: false,
  });

  const adjustmentColumns = useAdjustmentColumns();

  const ledgerColumns = useLedgerColumns();

  if (isLoading || !data) {
    return <AdminCustomerDetailSkeleton />;
  }

  const { adjustments, boostLedger, customer, subscriptions, transactions } =
    data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>{customer.email ?? customer.id}</span>
            <Badge
              variant={customer.status === "active" ? "default" : "outline"}
            >
              {customer.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.paddleId}
            </span>
            <span className="font-mono">{customer.id}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.name}
            </span>
            <span>{customer.name ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.linkedSupabaseUser}
            </span>
            <span className="font-mono">{customer.supabaseUserId ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.created}
            </span>
            <span className="tabular-nums">
              {formatDate(new Date(customer.createdAt), {
                dateStyle: "medium",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {content.billingCustomer.noSubscriptions}
          </CardContent>
        </Card>
      ) : (
        subscriptions.map((sub) => (
          <AdminSubscriptionCard
            key={sub.id}
            onCancel={handleCancel}
            onChangeSlots={handleChangeSlots}
            onPause={handlePause}
            onResume={handleResume}
            subscription={sub}
          />
        ))
      )}

      <TableCard
        columns={transactionColumns}
        data={transactions}
        rowKey={(row) => row.id}
        title={content.billingCustomer.transactionsTitle.value}
      />

      <TableCard
        columns={adjustmentColumns}
        data={adjustments}
        rowKey={(row) => row.id}
        title={content.billingCustomer.adjustmentsTitle.value}
      />

      <TableCard
        columns={ledgerColumns}
        data={boostLedger}
        rowKey={(row) => row.id}
        title={content.billingCustomer.boostLedgerTitle.value}
      />

      {activeSubscription && (
        <>
          <AdminCancelSubDialog
            isOpen={cancelOpen}
            onOpenChange={setCancelOpen}
            subscriptionId={activeSubscription.id}
          />
          <AdminPauseSubDialog
            isOpen={pauseOpen}
            onOpenChange={setPauseOpen}
            subscriptionId={activeSubscription.id}
          />
          <AdminResumeSubDialog
            isOpen={resumeOpen}
            onOpenChange={setResumeOpen}
            subscriptionId={activeSubscription.id}
          />
          <AdminChangeSlotsDialog
            currentQuantity={activeSubscription.quantity}
            isOpen={slotsOpen}
            onOpenChange={setSlotsOpen}
            priceId={activeSubscription.plan}
            subscriptionId={activeSubscription.id}
          />
        </>
      )}

      <RefundDialog
        isOpen={refundOpen}
        onOpenChange={setRefundOpen}
        transaction={refundTarget}
      />
    </div>
  );
}

const CUSTOMER_TABLE_COLS = ["w-28", "w-40", "w-20", "w-24", "w-16"] as const;

function AdminCustomerDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="flex flex-col gap-1" key={index}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => (
              <div className="flex flex-col gap-1" key={index}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>

      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonCard
          headerWidth="w-40"
          key={index}
          className="justify-between gap-2.5"
        >
          <SkeletonTable cols={CUSTOMER_TABLE_COLS} />
        </SkeletonCard>
      ))}
    </div>
  );
}
