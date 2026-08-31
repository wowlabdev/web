"use client";

import type { AuraInfo, SpellInfo } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

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

type TalentsTableProps = {
  auras: AuraInfo[];
  spells: SpellInfo[];
};

export function TalentsTable({ auras, spells }: Readonly<TalentsTableProps>) {
  const content = useIntlayer("enginePage");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{content.columnTalent}</TableHead>
          <TableHead>{content.columnType}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spells.map((spell) => (
          <TableRow key={`spell-${spell.spell_id}`} className="border-none">
            <TableCell className="py-1.5">
              <EntityLink id={spell.spell_id} kind="spell" />
            </TableCell>
            <TableCell className="py-1.5">
              <Badge variant="secondary">{content.typeSpell}</Badge>
            </TableCell>
          </TableRow>
        ))}
        {auras.map((aura) => (
          <TableRow key={`aura-${aura.aura_id}`} className="border-none">
            <TableCell className="py-1.5">
              <EntityLink id={aura.aura_id} kind="aura" />
            </TableCell>
            <TableCell className="py-1.5">
              <Badge variant="outline">{content.typeAura}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
