"use client";

import type { ReactNode } from "react";

import { useMemo } from "react";

import type { Spell } from "@wowlab/shared/lib/supabase/types";

import {
  usePowerTypeNames,
  useSchoolNames,
  useSpell,
  useSpells,
} from "@/lib/game-data";
import {
  buildCoreFieldRows,
  buildEffectRows,
  getEffectSpellCandidates,
  getTriggerSpellIds,
} from "@/lib/game-data/inspect";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";

import { InspectEntityHeader } from "./inspect-entity-header";
import { InspectEntitySkeleton } from "./inspect-entity-skeleton";
import { SpellLink } from "./inspect-links";
import { InspectNotFound } from "./inspect-not-found";
import { SpellManifestPanel } from "./inspect-spell-manifest";

type InspectSpellPageProps = {
  spellId: number;
};

export function InspectSpellPage({ spellId }: Readonly<InspectSpellPageProps>) {
  const { data: spell, isLoading, notFound } = useSpell(spellId);

  if (spellId > 0 && isLoading) {
    return <InspectEntitySkeleton />;
  }

  if (!spell || notFound) {
    return <InspectNotFound>Spell #{spellId} not found.</InspectNotFound>;
  }

  return <SpellContent spell={spell} />;
}

function SpellContent({ spell }: Readonly<{ spell: Spell }>) {
  const powerNames = usePowerTypeNames();
  const schoolName = useSchoolNames();
  const coreRows = buildCoreFieldRows(spell, powerNames);
  const effectRows = buildEffectRows(spell);
  const triggerIds = getTriggerSpellIds(spell);

  const candidateIds = useMemo(
    () => [...new Set([...triggerIds, ...getEffectSpellCandidates(spell)])],
    [spell, triggerIds],
  );
  const { data: refSpells } = useSpells(candidateIds);
  const spellMap = useMemo(
    () => new Map((refSpells ?? []).map((s) => [s.id, s])),
    [refSpells],
  );

  const spellOrText = (value: number, fallback: ReactNode): ReactNode => {
    const match = spellMap.get(Math.round(value));

    return match ? (
      <SpellLink id={match.id} name={match.name} />
    ) : (
      <>{fallback}</>
    );
  };

  return (
    <div className="space-y-6">
      <InspectEntityHeader
        id={spell.id}
        name={spell.name}
        iconName={spell.file_name}
        badges={
          <>
            <Badge variant="outline">{schoolName(spell.school_mask)}</Badge>
            {spell.is_passive && <Badge variant="secondary">passive</Badge>}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <TableCard
          title="Core fields"
          data={coreRows}
          rowKey={(row) => row.label}
          columns={[
            { cell: (row) => row.label, header: "Field" },
            {
              cell: (row) => (
                <span className="font-mono">
                  {row.value}
                  {row.hint ? (
                    <span className="text-muted-foreground ml-2 text-xs">
                      {row.hint}
                    </span>
                  ) : null}
                </span>
              ),
              className: "pr-6",
              header: "Value",
            },
          ]}
        />

        {triggerIds.length > 0 && (
          <TableCard
            title="Triggers spells"
            data={triggerIds}
            rowKey={(id) => id}
            columns={[
              {
                cell: (id) => (
                  <SpellLink
                    id={id}
                    name={spellMap.get(id)?.name}
                    iconName={spellMap.get(id)?.file_name}
                  />
                ),
                className: "pr-6",
                header: "Triggered spell",
              },
            ]}
          />
        )}
      </div>

      <TableCard
        title="Effects"
        data={effectRows}
        rowKey={(row) => row.index}
        columns={[
          { cell: (row) => `#${row.index}`, header: "#" },
          {
            cell: (row) =>
              row.effectType === 0 ? "--" : String(row.effectType),
            header: "Effect type",
          },
          {
            cell: (row) => (row.auraType === 0 ? "--" : String(row.auraType)),
            header: "Aura type",
          },
          {
            cell: (row) =>
              row.basePoints === 0
                ? "--"
                : spellOrText(row.basePoints, String(row.basePoints)),
            header: "Base",
          },
          { cell: (row) => row.apCoef, header: "AP coef" },
          { cell: (row) => row.spCoef, header: "SP coef" },
          { cell: (row) => row.period, header: "Period" },
          {
            cell: (row) => (row.chain === 0 ? "--" : String(row.chain)),
            header: "Chain",
          },
          {
            cell: (row) =>
              row.triggerSpell > 0
                ? spellOrText(row.triggerSpell, `#${row.triggerSpell}`)
                : "--",
            header: "Trigger",
          },
          {
            cell: (row) =>
              row.miscValue0 === 0 && row.miscValue1 === 0 ? (
                "--"
              ) : (
                <span className="inline-flex items-center gap-1">
                  {spellOrText(row.miscValue0, String(row.miscValue0))}
                  <span className="text-muted-foreground">/</span>
                  {spellOrText(row.miscValue1, String(row.miscValue1))}
                </span>
              ),
            header: "Misc",
          },
          { cell: (row) => row.radius, className: "pr-6", header: "Radius" },
        ]}
      />

      <SpellManifestPanel spell={spell} />
    </div>
  );
}
