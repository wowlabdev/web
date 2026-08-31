"use client";

import { Gauge, Package, ShieldCheck } from "lucide-react";

import type { Item } from "@wowlab/shared/lib/supabase/types";

import { useItemEffectTriggerLabels } from "@/components/shared/game/use-item-effect-trigger-labels";
import { useStatNames } from "@/components/shared/game/use-stat-names";
import { useItem } from "@/lib/game-data";
import { getItemEffects, getItemStats } from "@/lib/game-data/inspect";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";

import { InspectEntityHeader } from "./inspect-entity-header";
import { InspectEntitySkeleton } from "./inspect-entity-skeleton";
import { SpellLink } from "./inspect-links";
import { InspectNotFound } from "./inspect-not-found";

type InspectItemPageProps = {
  itemId: number;
};

export function InspectItemPage({ itemId }: Readonly<InspectItemPageProps>) {
  const { data: item, isLoading, notFound } = useItem(itemId);

  if (itemId <= 0 || notFound) {
    return <InspectNotFound>Item #{itemId} not found.</InspectNotFound>;
  }

  if (isLoading || !item) {
    return <InspectEntitySkeleton />;
  }

  return <ItemContent item={item} />;
}

function ItemContent({ item }: Readonly<{ item: Item }>) {
  const statNames = useStatNames();
  const triggerLabels = useItemEffectTriggerLabels();
  const stats = getItemStats(item);
  const effects = getItemEffects(item);

  return (
    <div className="space-y-6">
      <InspectEntityHeader
        id={item.id}
        name={item.name}
        iconName={item.file_name}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Gauge className="size-4" />}
          value={String(item.item_level)}
          title="Item level"
          changePercentage={`quality ${item.quality}`}
        />
        <StatCard
          icon={<ShieldCheck className="size-4" />}
          value={String(item.required_level)}
          title="Required level"
          changePercentage={`slot ${item.inventory_type}`}
        />
        <StatCard
          icon={<Package className="size-4" />}
          value={String(effects.length)}
          title="Effects"
          changePercentage={`${stats.length} stats`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {stats.length > 0 && (
          <TableCard
            title="Stats"
            data={stats}
            rowKey={(row) => row.statType}
            columns={[
              {
                cell: (row) => statNames[row.statType] ?? `#${row.statType}`,
                header: "Stat",
              },
              {
                cell: (row) => String(row.value),
                className: "text-end pr-6",
                header: "Value",
              },
            ]}
          />
        )}

        {effects.length > 0 && (
          <TableCard
            title="Effects / procs"
            data={effects}
            rowKey={(row) => row.spellId}
            columns={[
              {
                cell: (row) => <SpellLink id={row.spellId} />,
                header: "Spell",
              },
              {
                cell: (row) =>
                  triggerLabels[row.triggerType] ?? `#${row.triggerType}`,
                header: "Trigger",
              },
              { cell: (row) => row.cooldown, header: "Cooldown" },
              {
                cell: (row) => row.charges,
                className: "pr-6",
                header: "Charges",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
