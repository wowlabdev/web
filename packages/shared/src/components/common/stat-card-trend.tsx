import type { ReactNode } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

export type StatCardTrendProps = {
  badgeContent: string;
  changePercentage: string;
  className?: string;
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  trend: "up" | "down";
  value: string;
};

export function StatCardTrend({
  badgeContent,
  changePercentage,
  className,
  icon,
  iconClassName,
  title,
  trend,
  value,
}: Readonly<StatCardTrendProps>) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="flex items-center justify-between">
        <Avatar className="size-9.5 rounded-md">
          <AvatarFallback
            className={cn(
              "bg-primary/10 text-primary size-9.5 shrink-0 rounded-md [&>svg]:size-4.75",
              iconClassName,
            )}
          >
            {icon}
          </AvatarFallback>
        </Avatar>
        <p className="flex items-center gap-1">
          {changePercentage}{" "}
          {trend === "up" ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <p className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{value}</span>
          <span className="text-muted-foreground text-sm">{title}</span>
        </p>
        <Badge className="bg-primary/10 text-primary">{badgeContent}</Badge>
      </CardContent>
    </Card>
  );
}
