import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

type MdCardGridProps = {
  children: ReactNode;
  columns?: 2 | 3;
};

type MdCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

type MdFeatureCardProps = {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
};

export function MdCard({
  children,
  description,
  title,
}: Readonly<MdCardProps>) {
  return (
    <Card className="my-4">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function MdCardGrid({
  children,
  columns = 2,
}: Readonly<MdCardGridProps>) {
  return (
    <div
      className={cn(
        "my-6 grid gap-4",
        columns === 2
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

export function MdFeatureCard({
  children,
  icon,
  title,
}: Readonly<MdFeatureCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{children}</CardContent>
    </Card>
  );
}
