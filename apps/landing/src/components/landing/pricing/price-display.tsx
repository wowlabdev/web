"use client";

import type { ReactNode } from "react";

import { useRequest } from "ahooks";

import { previewPrice } from "@wowlab/shared/lib/paddle/client";
import { cn } from "@wowlab/shared/lib/utils";

type PriceDisplayProps = {
  amount: ReactNode;
  prefix?: ReactNode;
  priceId?: string;
  quantity?: number;
  size?: "2xl" | "3xl";
  suffix?: ReactNode;
};

const SIZE_CLASS: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

export function PriceDisplay({
  amount,
  prefix,
  priceId,
  quantity = 1,
  size = "3xl",
  suffix,
}: Readonly<PriceDisplayProps>) {
  const staticPrice = (
    <>
      {prefix ? (
        <span className="text-muted-foreground text-sm">{prefix}</span>
      ) : null}
      <span className={cn(SIZE_CLASS[size], "font-bold tabular-nums")}>
        {amount}
      </span>
      {suffix ? (
        <span className="text-muted-foreground ml-1 text-xs">{suffix}</span>
      ) : null}
    </>
  );

  if (priceId) {
    return (
      <LivePrice
        priceId={priceId}
        quantity={quantity}
        size={size}
        fallback={staticPrice}
      />
    );
  }

  return staticPrice;
}

function LivePrice({
  fallback,
  priceId,
  quantity,
  size,
}: Readonly<{
  priceId: string;
  quantity: number;
  size: NonNullable<PriceDisplayProps["size"]>;
  fallback: ReactNode;
}>) {
  const { data } = useRequest(() => previewPrice(priceId, quantity), {
    cacheKey: `${priceId}:${quantity}`,
    refreshDeps: [priceId, quantity],
  });

  if (data) {
    return (
      <span className={cn(SIZE_CLASS[size], "font-bold tabular-nums")}>
        {data.total}
      </span>
    );
  }

  return <>{fallback}</>;
}
