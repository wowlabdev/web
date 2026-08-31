import { Fragment, type ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";
import { cn } from "@wowlab/shared/lib/utils";

type Column<T> = {
  cell: (row: T) => ReactNode;
  className?: string;
  header: string;
};

type TableCardProps<T> = {
  className?: string;
  columns: Column<T>[];
  data: T[];
  headerActions?: ReactNode;
  isRowExpanded?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  renderExpandedRow?: (row: T) => ReactNode;
  rowKey: (row: T, index: number) => string | number;
  title: ReactNode;
};

export function TableCard<T>({
  className,
  columns,
  data,
  headerActions,
  isRowExpanded,
  onRowClick,
  renderExpandedRow,
  rowKey,
  title,
}: Readonly<TableCardProps<T>>) {
  return (
    <Card className={cn("justify-between gap-2.5", className)}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-lg font-semibold">{title}</span>
        {headerActions ? (
          <div className="flex items-center gap-3">{headerActions}</div>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className={cn(
                    columns[0] === column && "pl-6",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const isExpanded = isRowExpanded?.(row) ?? false;

              return (
                <Fragment key={rowKey(row, index)}>
                  <TableRow
                    className={cn(
                      "border-none",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.header}
                        className={cn(
                          columns[0] === column && "pl-6",
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && renderExpandedRow && (
                    <TableRow className="border-none hover:bg-transparent">
                      <TableCell
                        colSpan={columns.length}
                        className="px-6 pt-0 pb-4"
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
