"use client";

import type { SpellInfo } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import {
  formatCooldown,
  formatCost,
  formatDamage,
  formatSpellTimingMs,
} from "@/lib/engine/formatters";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import { EntityLink } from "./entity-link";

type SpellsTableProps = {
  resourceName: string;
  spells: SpellInfo[];
};

export function SpellsTable({
  resourceName,
  spells,
}: Readonly<SpellsTableProps>) {
  const content = useIntlayer("enginePage");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{content.columnSpell}</TableHead>
          <TableHead>{content.cast}</TableHead>
          <TableHead>{content.cooldown}</TableHead>
          <TableHead>{content.cost}</TableHead>
          <TableHead>{content.damage}</TableHead>
          <TableHead>{content.columnFlags}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spells.map((spell) => (
          <TableRow key={spell.spell_id} className="border-none">
            <TableCell className="py-1.5">
              <EntityLink id={spell.spell_id} kind="spell" />
            </TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatSpellTimingMs(spell.cast_time_ms)}
            </TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatCooldown(spell.cooldown)}
            </TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatCost(
                spell.resource_cost,
                spell.resource_gain,
                resourceName,
              )}
            </TableCell>
            <TableCell className="py-1.5 text-sm">
              {formatDamage(spell.damage)}
            </TableCell>
            <TableCell className="py-1.5">
              <span className="inline-flex gap-1">
                {spell.off_gcd && (
                  <Badge variant="secondary">{content.badgeOffGcd}</Badge>
                )}
                {spell.is_pet && (
                  <Badge variant="secondary">{content.badgePet}</Badge>
                )}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
