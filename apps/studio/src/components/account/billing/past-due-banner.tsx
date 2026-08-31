"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useAuthUser } from "@/lib/query/services";
import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import { Link } from "@wowlab/shared/components/ui/link";
import { makeBillingUrl } from "@wowlab/shared/lib/links";

export function PastDueBanner() {
  const { subscription } = useAuthUser();
  const content = useIntlayer("billingBanner");

  if (!subscription.isPastDue) {
    return null;
  }

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <AlertTriangleIcon className="size-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{content.pastDueMessage}</span>
        <Link
          href={makeBillingUrl()}
          className="text-destructive-foreground underline underline-offset-2 text-sm font-medium shrink-0"
        >
          {content.viewBilling}
        </Link>
      </AlertDescription>
    </Alert>
  );
}
