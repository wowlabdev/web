"use client";

import type { SpellInfo } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { useResolvedSpecIntrospection } from "@/lib/query/services";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import type { ActionEntry } from "../types";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import {
  formatCooldownCharges,
  formatDamageCoefficient,
  formatGain,
  formatResourceCost,
} from "./spell-detail-format";

export function SpellDetailPanel() {
  const content = useIntlayer("rotationEditor");
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const script = useEditorDocument((s) => s.script);
  const specId = useEditorDocument((s) => s.metadata.specId);

  const action = useMemo<ActionEntry | null>(() => {
    if (!selectionFocus) {
      return null;
    }

    if (!Object.hasOwn(script.lists, selectionFocus.listId)) {
      return null;
    }

    const list = script.lists[selectionFocus.listId];

    return list[selectionFocus.actionIndex] ?? null;
  }, [selectionFocus, script.lists]);

  const { data: intro } = useResolvedSpecIntrospection(specId);

  const spell = useMemo<null | SpellInfo>(() => {
    const slug = action?.spell;

    if (!slug || !intro) {
      return null;
    }

    return intro.spells.find((s) => s.slug === slug) ?? null;
  }, [action, intro]);

  if (!selectionFocus) {
    return (
      <p className="text-muted-foreground text-xs">
        {content.spellDetailIdleHint}
      </p>
    );
  }

  if (!action?.spell) {
    return (
      <p className="text-muted-foreground text-xs">
        {content.spellDetailNoSpell}
      </p>
    );
  }

  if (!spell) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm">{action.spell}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {content.spellDetailUnresolved}
          </p>
        </CardContent>
      </Card>
    );
  }

  const rows = [
    {
      key: "castTime",
      label: content.spellDetailCastTime.value,
      value: `${spell.cast_time_ms} ms`,
    },
    {
      key: "gcd",
      label: content.spellDetailGcd.value,
      value: `${spell.gcd_ms} ms`,
    },
    {
      key: "cost",
      label: content.spellDetailCost.value,
      value:
        spell.resource_cost === 0 && spell.secondary_resource_cost === 0
          ? "--"
          : formatResourceCost(
              spell.resource_cost,
              spell.secondary_resource_cost,
            ),
    },
    {
      key: "gain",
      label: content.spellDetailGain.value,
      value:
        spell.resource_gain === 0 && spell.secondary_resource_gain === 0
          ? "--"
          : formatGain(spell.resource_gain, spell.secondary_resource_gain),
    },
    {
      key: "cooldown",
      label: content.spellDetailCooldown.value,
      value: formatCooldownCharges(spell.cooldown),
    },
    {
      key: "aura",
      label: content.spellDetailAura.value,
      value:
        spell.applies_aura_id == null ? "--" : `id ${spell.applies_aura_id}`,
    },
    {
      key: "damage",
      label: content.spellDetailDamage.value,
      value: formatDamageCoefficient(spell.damage),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-sm">{spell.name}</CardTitle>
          <p className="text-muted-foreground font-mono text-xs">
            {spell.slug} · {content.spellDetailIdLabel} {spell.spell_id}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {spell.off_gcd && (
            <Badge variant="secondary">{content.spellDetailOffGcd}</Badge>
          )}
          {spell.is_pet && (
            <Badge variant="secondary">{content.spellDetailPet}</Badge>
          )}
          {spell.breaks_stealth && (
            <Badge variant="secondary">
              {content.spellDetailBreaksStealth}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-xs">
          {rows.map((row) => (
            <Row key={row.key} label={row.label} value={row.value} />
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono">{value}</dd>
    </>
  );
}
