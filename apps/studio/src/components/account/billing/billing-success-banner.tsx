"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  AUTH_SUBSCRIPTION_KEY,
  BILLING_KEY,
} from "@/lib/query/services/billing";
import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";

export function BillingSuccessBanner() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const invalidatedRef = useRef(false);
  const content = useIntlayer("accountPage");

  const ok = searchParams.get("ok") === "1";

  useEffect(() => {
    if (ok && !invalidatedRef.current) {
      invalidatedRef.current = true;
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
    }
  }, [ok, queryClient]);

  if (!ok) {
    return null;
  }

  return (
    <Alert>
      <CheckCircle2Icon className="size-4" />
      <AlertDescription>{content.billingSuccessMessage}</AlertDescription>
    </Alert>
  );
}
