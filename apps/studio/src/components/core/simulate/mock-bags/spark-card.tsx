"use client";

import { useNumber } from "next-intlayer/format";

import { AreaChart } from "@/components/shared/ui/charts";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card } from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

export type SparkCardProps = {
  change: number;
  chartData: SparkRow[];
  className?: string;
  dataKey?: keyof SparkRow & string;
  name: string;
  ticker: string;
  value: string;
};

type SparkRow = { label: string; value: number };

export function SparkCard({
  change,
  chartData,
  className,
  dataKey = "value",
  name,
  ticker,
  value,
}: Readonly<SparkCardProps>) {
  const fmtNumber = useNumber();
  const isPositive = change >= 0;
  const accentColor = isPositive
    ? "var(--color-green-500)"
    : "var(--destructive)";
  const formattedChange = fmtNumber(change / 100, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    signDisplay: "exceptZero",
    style: "percent",
  });

  return (
    <Card
      className={cn(
        "flex flex-col gap-0 overflow-hidden p-0 shadow-none",
        className,
      )}
    >
      <div className="flex flex-col gap-1 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{ticker}</span>
          <Badge
            variant="outline"
            className={cn(
              "rounded-sm border-0 font-medium tabular-nums",
              isPositive
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {formattedChange}
          </Badge>
        </div>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
        <p className="text-muted-foreground truncate text-xs">{name}</p>
      </div>
      {chartData.length >= 2 && (
        <div className="mt-auto w-full">
          <AreaChart
            data={chartData}
            height={64}
            series={[{ color: accentColor, dataKey, label: name }]}
            variant="sparkline"
            xAxis={{ dataKey: "label" }}
          />
        </div>
      )}
    </Card>
  );
}
