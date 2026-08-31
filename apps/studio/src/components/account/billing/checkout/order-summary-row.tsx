import { cn } from "@wowlab/shared/lib/utils";

type OrderSummaryRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function OrderSummaryRow({
  label,
  value,
  valueClassName,
}: Readonly<OrderSummaryRowProps>) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div
        className={cn(
          "text-xs tabular-nums",
          valueClassName ?? "text-muted-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}
