"use client";

import { useBoolean, useLockFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { SubscriptionActionDialog } from "@/components/shared/billing";
import { useAdminCancelSubscription } from "@/lib/query/services";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

type AdminCancelSubDialogProps = {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  subscriptionId: string;
};

export function AdminCancelSubDialog({
  isOpen,
  onOpenChange,
  subscriptionId,
}: Readonly<AdminCancelSubDialogProps>) {
  const content = useIntlayer("admin");
  const [immediate, { setFalse: setEndOfPeriod, setTrue: setImmediate }] =
    useBoolean(false);
  const cancel = useAdminCancelSubscription();

  const handleConfirm = useLockFn(async () => {
    try {
      await cancel.mutateAsync({ immediate, subscriptionId });
      onOpenChange(false);
    } catch {
      // surfaced via cancel.error
    }
  });

  return (
    <SubscriptionActionDialog
      cancelLabel={content.billingCancelDialog.keepSubscription}
      confirmLabel={
        cancel.isPending
          ? content.billingCancelDialog.cancelling
          : content.billingCancelDialog.cancelSubscription
      }
      confirmVariant="destructive"
      description={content.billingCancelDialog.description}
      error={cancel.error}
      errorTitle={content.billingCancelDialog.errorTitle}
      isOpen={isOpen}
      isPending={cancel.isPending}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
      title={content.billingCancelDialog.title}
    >
      <ToggleGroup
        className="grid grid-cols-2 gap-2"
        onValueChange={(value) => {
          if (value === "immediate") {
            setImmediate();
          } else if (value === "endOfPeriod") {
            setEndOfPeriod();
          }
        }}
        type="single"
        value={immediate ? "immediate" : "endOfPeriod"}
        variant="outline"
      >
        <ToggleGroupItem value="endOfPeriod">
          {content.billingCancelDialog.endOfPeriod}
        </ToggleGroupItem>
        <ToggleGroupItem value="immediate">
          {content.billingCancelDialog.immediately}
        </ToggleGroupItem>
      </ToggleGroup>
    </SubscriptionActionDialog>
  );
}
