"use client";

import type { ResolvedItem } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { JournalLootVariant } from "@/lib/query/services/game";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { stableId } from "@wowlab/shared/lib/id";

import type { LootRow } from "./types";

import { getBonusVariantKey } from "./loot-grid-scaling";

type LootVariantFallbackProps = {
  resolved: ResolvedItem;
};

type LootVariantPickerProps = {
  enabledBonusIds: number[];
  onChange: (bonusIds: number[]) => void;
  row: LootRow;
  variantMap: Map<string, JournalLootVariant>;
};

type LootVariantSelectorProps = {
  enabledBonusIds: number[];
  onChange: (bonusIds: number[]) => void;
  resolved: ResolvedItem;
  row: LootRow;
};

export function LootVariantSelector({
  enabledBonusIds,
  onChange,
  resolved,
  row,
}: Readonly<LootVariantSelectorProps>) {
  const variantMap = useMemo(
    () =>
      new Map(
        row.bonusVariants.map((v) => [getBonusVariantKey(v.bonusIds), v]),
      ),
    [row.bonusVariants],
  );

  return (
    <div className="min-w-0 space-y-2">
      {row.bonusVariants.length > 1 ? (
        <LootVariantPicker
          enabledBonusIds={enabledBonusIds}
          onChange={onChange}
          row={row}
          variantMap={variantMap}
        />
      ) : (
        <LootVariantFallback resolved={resolved} />
      )}

      {enabledBonusIds.length > 0 && (
        <p
          aria-live="polite"
          className="truncate font-mono text-[11px] text-muted-foreground"
        >
          {enabledBonusIds.join(" / ")}
        </p>
      )}
    </div>
  );
}

function LootVariantFallback({ resolved }: Readonly<LootVariantFallbackProps>) {
  const content = useIntlayer("journalPage");

  return (
    <div className="flex h-10 items-center justify-between border bg-muted/20 px-3 text-sm">
      <span className="text-muted-foreground">{content.variantFixedLabel}</span>
      <span className="font-medium tabular-nums">
        {content.variantIlvl({ level: resolved.item_level })}
      </span>
    </div>
  );
}

function LootVariantPicker({
  enabledBonusIds,
  onChange,
  row,
  variantMap,
}: Readonly<LootVariantPickerProps>) {
  const content = useIntlayer("journalPage");
  const selectedVariantKey = getBonusVariantKey(enabledBonusIds);

  return (
    <Select
      value={selectedVariantKey}
      onValueChange={(value) => {
        const variant = variantMap.get(value);

        if (variant) {
          onChange(variant.bonusIds);
        }
      }}
    >
      <SelectTrigger className="h-10 w-full justify-between text-sm">
        <SelectValue placeholder={content.variantPlaceholder.value} />
      </SelectTrigger>
      <SelectContent align="start" className="min-w-72">
        {row.bonusVariants.map((variant) => (
          <SelectItem
            key={stableId("journal-variant", [
              row.itemId,
              variant.difficultyKey,
              getBonusVariantKey(variant.bonusIds),
            ])}
            value={getBonusVariantKey(variant.bonusIds)}
          >
            {variant.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
