"use client";

import { useLockFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { useAdminResumeSubscription } from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@wowlab/shared/components/ui/alert-dialog";

type AdminResumeSubDialogProps = {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  subscriptionId: string;
};

export function AdminResumeSubDialog({
  isOpen,
  onOpenChange,
  subscriptionId,
}: Readonly<AdminResumeSubDialogProps>) {
  const content = useIntlayer("admin");
  const resume = useAdminResumeSubscription();

  const handleConfirm = useLockFn(async () => {
    try {
      await resume.mutateAsync({ subscriptionId });
      onOpenChange(false);
    } catch {
      // surfaced via resume.error
    }
  });

  return (
    <AlertDialog onOpenChange={onOpenChange} open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle>
            {content.billingResumeDialog.title}
          </AlertDialogTitle>
          <p className="text-muted-foreground text-sm">
            {content.billingResumeDialog.description}
          </p>
        </AlertDialogHeader>

        {resume.error && (
          <Alert variant="destructive">
            <AlertTitle>{content.billingResumeDialog.errorTitle}</AlertTitle>
            <AlertDescription>{resume.error.message}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter className="mt-4 gap-2 sm:justify-end">
          <AlertDialogCancel>
            {content.billingResumeDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={resume.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {resume.isPending
              ? content.billingResumeDialog.resuming
              : content.billingResumeDialog.resumeSubscription}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
