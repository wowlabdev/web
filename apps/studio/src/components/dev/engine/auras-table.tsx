"use client";

import type { AuraInfo } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { formatPeriodic, formatSpellTimingMs } from "@/lib/engine/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import { EntityLink } from "./entity-link";

type AurasTableProps = {
  auras: AuraInfo[];
};

export function AurasTable({ auras }: Readonly<AurasTableProps>) {
  const content = useIntlayer("enginePage");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{content.columnAura}</TableHead>
          <TableHead>{content.columnTarget}</TableHead>
          <TableHead>{content.columnDuration}</TableHead>
          <TableHead>{content.columnStacks}</TableHead>
          <TableHead>{content.columnPandemic}</TableHead>
          <TableHead>{content.columnPeriodic}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auras.map((aura) => (
          <TableRow key={aura.aura_id} className="border-none">
            <TableCell className="py-1.5">
              <EntityLink id={aura.aura_id} kind="aura" />
            </TableCell>
            <TableCell className="py-1.5 text-sm">{aura.on}</TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatSpellTimingMs(aura.base_duration_ms)}
            </TableCell>
            <TableCell className="py-1.5 text-sm">{aura.max_stacks}</TableCell>
            <TableCell className="py-1.5 text-sm">
              {aura.pandemic ? content.yes : content.no}
            </TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatPeriodic(aura.periodic)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
