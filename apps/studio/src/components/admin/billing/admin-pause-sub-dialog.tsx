"use client";

import { useBoolean, useLockFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { SubscriptionActionDialog } from "@/components/shared/billing";
import { useAdminPauseSubscription } from "@/lib/query/services";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

type AdminPauseSubDialogProps = {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  subscriptionId: string;
};

export function AdminPauseSubDialog({
  isOpen,
  onOpenChange,
  subscriptionId,
}: Readonly<AdminPauseSubDialogProps>) {
  const content = useIntlayer("admin");
  const [
    isImmediate,
    { setFalse: setImmediateFalse, setTrue: setImmediateTrue },
  ] = useBoolean(false);
  const pause = useAdminPauseSubscription();

  const handleConfirm = useLockFn(async () => {
    try {
      await pause.mutateAsync({ immediate: isImmediate, subscriptionId });
      onOpenChange(false);
    } catch {
      // surfaced via pause.error
    }
  });

  return (
    <SubscriptionActionDialog
      cancelLabel={content.billingPauseDialog.keepActive}
      confirmLabel={
        pause.isPending
          ? content.billingPauseDialog.pausing
          : content.billingPauseDialog.pauseSubscription
      }
      description={content.billingPauseDialog.description}
      error={pause.error}
      errorTitle={content.billingPauseDialog.errorTitle}
      isOpen={isOpen}
      isPending={pause.isPending}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
      title={content.billingPauseDialog.title}
    >
      <ToggleGroup
        className="grid grid-cols-2 gap-2"
        onValueChange={(value) => {
          if (value === "immediate") {
            setImmediateTrue();
          } else if (value === "endOfPeriod") {
            setImmediateFalse();
          }
        }}
        type="single"
        value={isImmediate ? "immediate" : "endOfPeriod"}
        variant="outline"
      >
        <ToggleGroupItem value="endOfPeriod">
          {content.billingPauseDialog.endOfPeriod}
        </ToggleGroupItem>
        <ToggleGroupItem value="immediate">
          {content.billingPauseDialog.immediately}
        </ToggleGroupItem>
      </ToggleGroup>
    </SubscriptionActionDialog>
  );
}
