"use client";

import type { GearSlot, Profile } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import type { InventoryRow } from "@/components/core/simulate/inventory-slot-table";

import { InventorySelectionStats } from "@/components/core/simulate/inventory-selection-stats";
import { InventorySelectionToolbar } from "@/components/core/simulate/inventory-selection-toolbar";
import { InventorySlotTable } from "@/components/core/simulate/inventory-slot-table";
import { EquipmentGrid } from "@/components/shared/character/equipment-grid";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { SLOT_ORDER } from "@/lib/sim/slots";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

type BagsInventoryStepProps = {
  combinationCount: number;
  getSlotItems: (slot: GearSlot) => InventoryRow[];
  hasInventory: boolean;
  onBack: () => void;
  onDeselectAll: () => void;
  onIncludeWeeklyChange: (next: boolean) => void;
  onNext: () => void;
  onSelectAll: () => void;
  onToggleItem: (slot: string, index: number) => void;
  profile: Profile;
  selectedCount: number;
  shouldIncludeWeekly: boolean;
  totalAvailable: number;
};

export function BagsInventoryStep({
  combinationCount,
  getSlotItems,
  hasInventory,
  onBack,
  onDeselectAll,
  onIncludeWeeklyChange,
  onNext,
  onSelectAll,
  onToggleItem,
  profile,
  selectedCount,
  shouldIncludeWeekly,
  totalAvailable,
}: Readonly<BagsInventoryStepProps>) {
  const shared = useIntlayer("simulateShared");

  return (
    <>
      <InventorySelectionStats
        combinationCount={combinationCount}
        selectedCount={selectedCount}
        totalAvailable={totalAvailable}
      />

      <InventorySelectionToolbar
        onDeselectAll={onDeselectAll}
        onSelectAll={onSelectAll}
        onToggleIncludeWeekly={onIncludeWeeklyChange}
        shouldIncludeWeekly={shouldIncludeWeekly}
      />

      <UrlTabs queryKey="view" defaultValue="paperdoll">
        <TabsList>
          <TabsTrigger value="paperdoll">{shared.tabPaperdoll}</TabsTrigger>
          <TabsTrigger value="grid">{shared.tabGrid}</TabsTrigger>
        </TabsList>

        <TabsContent value="paperdoll" className="space-y-4">
          <EquipmentGrid profile={profile} />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {hasInventory ? (
            SLOT_ORDER.map((slot) => {
              const items = getSlotItems(slot);

              if (items.length === 0) {
                return null;
              }

              return (
                <InventorySlotTable
                  key={slot}
                  items={items}
                  onToggleItem={onToggleItem}
                  slot={slot}
                />
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {shared.noBagItems}
            </p>
          )}
        </TabsContent>
      </UrlTabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {shared.back}
        </Button>
        <Button onClick={onNext} disabled={selectedCount === 0}>
          {shared.next}
        </Button>
      </div>
    </>
  );
}
