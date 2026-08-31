"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { NuqsIsland } from "@/components/islands/nuqs-island";
import { Button } from "@wowlab/shared/components/ui/button";
import { makeCheckoutUrl } from "@wowlab/shared/lib/links";

import { useDiscountCode } from "./use-discount-code";

type CheckoutButtonProps = {
  children: ReactNode;
  plan?: "guild" | "individual";
  priceId: string;
  quantity: number;
  variant?: "default" | "outline";
};

export function CheckoutButton(props: Readonly<CheckoutButtonProps>) {
  return (
    <NuqsIsland fallback={<CheckoutLink {...props} discount={undefined} />}>
      <CheckoutButtonInner {...props} />
    </NuqsIsland>
  );
}

function CheckoutButtonInner(props: Readonly<CheckoutButtonProps>) {
  const [discountCode] = useDiscountCode();

  return <CheckoutLink {...props} discount={discountCode || undefined} />;
}

function CheckoutLink({
  children,
  discount,
  plan,
  priceId,
  quantity,
  variant = "outline",
}: Readonly<{ discount: string | undefined } & CheckoutButtonProps>) {
  const opts = { discount, plan, priceId, quantity };

  return (
    <Button asChild size="sm" type="button" variant={variant}>
      <Link href={makeCheckoutUrl(opts)}>{children}</Link>
    </Button>
  );
}
