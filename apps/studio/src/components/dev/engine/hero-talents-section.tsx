"use client";

import type { HeroTalentTree } from "wowlab-common";

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

type HeroTalentsSectionProps = {
  trees: HeroTalentTree[];
};

export function HeroTalentsSection({
  trees,
}: Readonly<HeroTalentsSectionProps>) {
  const content = useIntlayer("enginePage");

  if (trees.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-sm">
        {content.noHeroTalents}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {trees.map((tree) => (
        <div key={tree.name}>
          <h3 className="mb-2 text-sm font-semibold">{tree.name}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.columnName}</TableHead>
                <TableHead>{content.columnType}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tree.spells.map(([, id]) => (
                <TableRow key={`spell-${id}`} className="border-none">
                  <TableCell className="py-1.5">
                    <EntityLink id={id} kind="spell" />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Badge variant="secondary">{content.typeSpell}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {tree.auras.map(([, id]) => (
                <TableRow key={`aura-${id}`} className="border-none">
                  <TableCell className="py-1.5">
                    <EntityLink id={id} kind="aura" />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Badge variant="outline">{content.typeAura}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
