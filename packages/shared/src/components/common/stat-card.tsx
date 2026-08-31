import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

type StatCardProps = {
  action?: ReactNode;
  changeLabel?: string;
  changePercentage: string;
  className?: string;
  icon: ReactNode;
  title: string;
  value: string;
};

export function StatCard({
  action,
  changeLabel,
  changePercentage,
  className,
  icon,
  title,
  value,
}: Readonly<StatCardProps>) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="flex items-center">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
          {icon}
        </div>
        <span className="text-2xl">{value}</span>
        {action ? <div className="ml-auto">{action}</div> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <p className="space-x-2">
          <span className="text-muted-foreground text-sm">
            {changePercentage}
          </span>
          {changeLabel && (
            <span className="text-muted-foreground text-sm">{changeLabel}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
