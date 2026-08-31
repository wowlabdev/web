"use client";

import type { ResolvedItem } from "wowlab-common";

import { useCreation } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { useGlobalColors } from "@/lib/game-data";
import { ITEM_CLASS_WEAPON } from "@/lib/game/item-class";
import { formatSpeed } from "@/lib/game/item-tooltip";
import { QUALITY_BADGE_CLASSES, QUALITY_COLOR_NAMES } from "@/lib/game/quality";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { stableIndexedId } from "@wowlab/shared/lib/id";
import { makeInspectItemUrl } from "@wowlab/shared/lib/links";
import { cn } from "@wowlab/shared/lib/utils";

import { GameTooltipShell } from "../game-tooltip-shell";
import { useBindingLabels } from "../use-binding-labels";
import { useInventoryTypeLabels } from "../use-inventory-type-labels";
import { useItemEffectTriggerLabels } from "../use-item-effect-trigger-labels";
import { useStatNames } from "../use-stat-names";

const QUALITY_LABEL_KEYS: readonly (
  | "qualityArtifact"
  | "qualityCommon"
  | "qualityEpic"
  | "qualityHeirloom"
  | "qualityLegendary"
  | "qualityPoor"
  | "qualityRare"
  | "qualityUncommon"
)[] = [
  "qualityPoor",
  "qualityCommon",
  "qualityUncommon",
  "qualityRare",
  "qualityEpic",
  "qualityLegendary",
  "qualityArtifact",
  "qualityHeirloom",
];

export type ItemTooltipBodyProps = {
  resolved: ResolvedItem;
};

export function ItemTooltipBody({ resolved }: Readonly<ItemTooltipBodyProps>) {
  const content = useIntlayer("gameComponents");
  const game = useIntlayer("sharedGame");
  const bindingLabels = useBindingLabels();
  const inventoryTypeLabels = useInventoryTypeLabels();
  const statNames = useStatNames();
  const effectTriggerLabels = useItemEffectTriggerLabels();
  const { data: colors } = useGlobalColors();

  const qualityColor = useCreation(() => {
    const name = QUALITY_COLOR_NAMES[resolved.quality];
    const match = (colors ?? []).find((c) => c.name === name);

    return match?.color ?? undefined;
  }, [colors, resolved]);

  const classification = resolved.classification;
  const slotLabel =
    classification?.inventory_type_name ??
    inventoryTypeLabels[resolved.inventory_type];
  const armorType = classification?.subclass_name;
  const bindingLabel = bindingLabels[resolved.binding];
  const isWeapon = resolved.class_id === ITEM_CLASS_WEAPON;
  const speedDisplay =
    isWeapon && resolved.speed ? formatSpeed(resolved.speed) : undefined;
  const qualityKey = QUALITY_LABEL_KEYS[resolved.quality] as
    (typeof QUALITY_LABEL_KEYS)[number] | undefined;
  const qualityLabel = qualityKey ? game[qualityKey].value : game.unknown.value;

  return (
    <GameTooltipShell
      iconName={resolved.file_name}
      href={makeInspectItemUrl(resolved.id)}
      header={
        <>
          <span
            className="text-sm font-semibold leading-tight"
            style={qualityColor ? { color: qualityColor } : undefined}
          >
            {resolved.name}
          </span>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-[10px]",
                QUALITY_BADGE_CLASSES[resolved.quality],
              )}
            >
              {qualityLabel}
            </Badge>
            <span className="text-xs text-amber-400/90">
              {content.itemLevel({ level: resolved.item_level })}
            </span>
          </div>
        </>
      }
    >
      {(bindingLabel || slotLabel || armorType) && (
        <div className="flex flex-col gap-0.5">
          {bindingLabel && (
            <span className="text-xs text-neutral-400">{bindingLabel}</span>
          )}
          {(slotLabel || armorType) && (
            <div className="flex items-center justify-between">
              {slotLabel && (
                <span className="text-xs text-neutral-300">{slotLabel}</span>
              )}
              {armorType &&
                armorType !== "Miscellaneous" &&
                armorType !== "Unknown" && (
                  <span className="text-xs text-neutral-300">{armorType}</span>
                )}
            </div>
          )}
          {speedDisplay && (
            <span className="text-xs text-neutral-400">
              {content.speed({ speed: speedDisplay })}
            </span>
          )}
        </div>
      )}

      {resolved.required_level > 0 && (
        <>
          {(bindingLabel || slotLabel || armorType) && (
            <Separator className="my-1.5 bg-neutral-800" />
          )}
          <span className="text-xs text-neutral-400">
            {content.requiresLevel({ level: resolved.required_level })}
          </span>
        </>
      )}

      {resolved.stats.length > 0 && (
        <>
          <Separator className="my-1.5 bg-neutral-800" />
          <div className="flex flex-col gap-0.5">
            {resolved.stats.map((stat, index) => (
              <span
                key={stableIndexedId(
                  "item-stat",
                  [resolved.id, stat.stat_type],
                  index,
                )}
                className="text-xs text-green-400"
              >
                +{stat.value} {statNames[stat.stat_type] ?? game.unknown.value}
              </span>
            ))}
          </div>
        </>
      )}

      {resolved.sockets.length > 0 && (
        <>
          <Separator className="my-1.5 bg-neutral-800" />
          <div className="flex flex-col gap-0.5">
            {resolved.sockets.map((socket, i) => (
              <span
                key={stableIndexedId(
                  "item-socket",
                  [resolved.id, socket.color],
                  i,
                )}
                className="text-xs text-neutral-400"
              >
                {socket.color === 1
                  ? content.socketPrismatic
                  : content.socketGeneric({ type: socket.color })}
              </span>
            ))}
          </div>
        </>
      )}

      {resolved.effects.length > 0 && (
        <>
          <Separator className="my-1.5 bg-neutral-800" />
          <div className="flex flex-col gap-0.5">
            {resolved.effects.map((effect, i) => (
              <span
                key={stableIndexedId(
                  "item-effect",
                  [resolved.id, effect.spell_id],
                  i,
                )}
                className="text-xs leading-relaxed text-green-400"
              >
                {effectTriggerLabels[effect.trigger_type] ? (
                  <span className="text-neutral-400">
                    {effectTriggerLabels[effect.trigger_type]}{" "}
                  </span>
                ) : null}
                {content.effectSpellId({ id: effect.spell_id })}
                {effect.cooldown > 0 && (
                  <>
                    {" "}
                    {content.effectCooldown({
                      seconds: Math.round(effect.cooldown / 1000),
                    })}
                  </>
                )}
              </span>
            ))}
          </div>
        </>
      )}

      {resolved.description && (
        <>
          <Separator className="my-1.5 bg-neutral-800" />
          <span className="text-xs leading-relaxed text-amber-400/80 italic">
            &quot;
            {resolved.description}
            &quot;
          </span>
        </>
      )}
    </GameTooltipShell>
  );
}
