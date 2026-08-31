import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { Skeleton } from "@wowlab/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";
import { cn } from "@wowlab/shared/lib/utils";

export { Skeleton } from "@wowlab/shared/components/ui/skeleton";

const COLS_CLASS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export function SkeletonCard({
  bodyLines = 3,
  children,
  className,
  footer = false,
  headerWidth = "w-40",
}: Readonly<{
  bodyLines?: number;
  children?: ReactNode;
  className?: string;
  footer?: boolean;
  headerWidth?: string;
}>) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className={cn("h-5", headerWidth)} />
      </CardHeader>
      <CardContent>
        {children ?? <SkeletonText lines={bodyLines} />}
      </CardContent>
      {footer && (
        <CardFooter>
          <Skeleton className="h-8 w-24" />
        </CardFooter>
      )}
    </Card>
  );
}

export function SkeletonField({
  className,
  inputClassName,
  labelClassName,
}: Readonly<{
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className={cn("h-4 w-24", labelClassName)} />
      <Skeleton className={cn("h-9 w-full", inputClassName)} />
    </div>
  );
}

export function SkeletonGrid({
  cellClassName,
  className,
  cols = 3,
  count,
  gapClassName = "gap-3",
}: Readonly<{
  cellClassName?: string;
  className?: string;
  cols?: 2 | 3 | 4;
  count: number;
  gapClassName?: string;
}>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        gapClassName,
        COLS_CLASS[cols],
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className={cn("h-28", cellClassName)} key={index} />
      ))}
    </div>
  );
}

export function SkeletonList({
  className,
  count,
  gapClassName = "space-y-2",
  rowClassName,
}: Readonly<{
  className?: string;
  count: number;
  gapClassName?: string;
  rowClassName?: string;
}>) {
  return (
    <div className={cn(gapClassName, className)}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className={cn("h-8 w-full", rowClassName)} key={index} />
      ))}
    </div>
  );
}

export function SkeletonMedia({
  className,
  iconClassName,
  subtitleClassName,
  titleClassName,
}: Readonly<{
  className?: string;
  iconClassName?: string;
  subtitleClassName?: string;
  titleClassName?: string;
}>) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className={cn("size-12 rounded-lg", iconClassName)} />
      <div className="space-y-2">
        <Skeleton className={cn("h-7 w-48", titleClassName)} />
        <Skeleton className={cn("h-4 w-20", subtitleClassName)} />
      </div>
    </div>
  );
}

export function SkeletonTable({
  className,
  cols,
  headers = true,
  leadingIcon = false,
  rows = 5,
}: Readonly<{
  className?: string;
  cols: readonly string[];
  headers?: boolean;
  leadingIcon?: boolean;
  rows?: number;
}>) {
  return (
    <Table className={className}>
      {headers && (
        <TableHeader>
          <TableRow>
            {leadingIcon && <TableHead />}
            {Array.from({ length: cols.length }, (_, index) => (
              <TableHead key={index}>
                <Skeleton className={cn("h-4", cols[index])} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {leadingIcon && (
              <TableCell>
                <Skeleton className="size-8 rounded-md" />
              </TableCell>
            )}
            {Array.from({ length: cols.length }, (_, index) => (
              <TableCell key={index}>
                <Skeleton className={cn("h-4", cols[index])} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function SkeletonText({
  className,
  lineClassName,
  lines = 3,
  widths,
}: Readonly<{
  className?: string;
  lineClassName?: string;
  lines?: number;
  widths?: readonly string[];
}>) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          className={cn("h-4", widths?.[index] ?? "w-full", lineClassName)}
          key={index}
        />
      ))}
    </div>
  );
}
