"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";

type OrderSummaryQuantityProps = {
  bounds: { max: number; min: number; step: number };
  onChange: (quantity: number) => void;
  value: number;
};

export function OrderSummaryQuantity({
  bounds,
  onChange,
  value,
}: Readonly<OrderSummaryQuantityProps>) {
  const content = useIntlayer("checkoutPage");

  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label={content.decreaseQuantity.value}
        disabled={value <= bounds.min}
        onClick={() => onChange(value - bounds.step)}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <MinusIcon className="size-3.5" />
      </Button>
      <div className="min-w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </div>
      <Button
        aria-label={content.increaseQuantity.value}
        disabled={value >= bounds.max}
        onClick={() => onChange(value + bounds.step)}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  );
}
