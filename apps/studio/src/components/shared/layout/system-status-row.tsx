import type { ReactNode } from "react";

import type { StatusTone } from "@wowlab/shared/components/common";

import { StatusDot } from "@wowlab/shared/components/common";
import { TableCell, TableRow } from "@wowlab/shared/components/ui/table";
import { cn } from "@wowlab/shared/lib/utils";

type SystemStatusRowProps = {
  detail?: ReactNode;
  isPulsing?: boolean;
  label: ReactNode;
  tone: StatusTone;
  value: ReactNode;
};

export function SystemStatusRow({
  detail,
  isPulsing = false,
  label,
  tone,
  value,
}: Readonly<SystemStatusRowProps>) {
  return (
    <>
      <TableRow
        className={cn("hover:bg-transparent", detail ? "border-0" : undefined)}
      >
        <TableCell className="py-2 pl-3">
          <span className="flex items-center gap-2">
            <StatusDot isPulsing={isPulsing} tone={tone} />
            {label}
          </span>
        </TableCell>
        <TableCell className="text-muted-foreground py-2 pr-3 text-right">
          {value}
        </TableCell>
      </TableRow>
      {detail ? (
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="text-muted-foreground/80 px-3 pt-0 pb-2 pl-[34px] text-[11px] leading-relaxed"
            colSpan={2}
          >
            <div className="flex flex-col gap-1.5">{detail}</div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
