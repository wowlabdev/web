"use client";

import type { GearSlot, Profile } from "wowlab-common";

import { useCreation } from "ahooks";
import { useIntlayer } from "next-intlayer";

import type { SlotGroup } from "@/components/core/simulate/use-slot-grouping";

import { InventorySelectionStats } from "@/components/core/simulate/inventory-selection-stats";
import { InventorySelectionToolbar } from "@/components/core/simulate/inventory-selection-toolbar";
import { InventorySlotTable } from "@/components/core/simulate/inventory-slot-table";
import { useSlotSelection } from "@/components/core/simulate/use-slot-selection";
import { EquipmentGrid } from "@/components/shared/character/equipment-grid";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { SLOT_ORDER } from "@/lib/sim/slots";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import type { SimItem, SlotState } from "./mock-data";
import type { BestSet, SimPhase } from "./source-badge";

import { InventorySimStats } from "./inventory-sim-stats";
import { InventorySimToolbar } from "./inventory-sim-toolbar";
import { totalPermutations } from "./mock-data";
import { SimCharacterView } from "./sim-character-view";
import { SimSlotCard } from "./sim-slot-card";

type InventoryStepProps = {
  bestPermDps: number;
  bestSet: BestSet;
  chunk: number;
  dpsHistory: { chunk: number; dps: number }[];
  expandedSlot: string | null;
  flashSlots: Set<string>;
  onBack: () => void;
  onNext: () => void;
  onResetSim: () => void;
  onToggleExpandedSlot: (slot: string) => void;
  permsSimmed: number;
  phase: SimPhase;
  profile: Profile;
  simItems: Map<string, SimItem[]>;
  simSlots: SlotState[];
  simsPerSec: number;
  slotGroups: Map<GearSlot, SlotGroup>;
};

export function InventoryStep({
  bestPermDps,
  bestSet,
  chunk,
  dpsHistory,
  expandedSlot,
  flashSlots,
  onBack,
  onNext,
  onResetSim,
  onToggleExpandedSlot,
  permsSimmed,
  phase,
  profile,
  simItems,
  simSlots,
  simsPerSec,
  slotGroups,
}: Readonly<InventoryStepProps>) {
  const shared = useIntlayer("simulateShared");
  const isSimActive = phase === "running" || phase === "complete";
  const totalPerms = totalPermutations(simItems);
  const slotMap = useCreation(
    () => new Map(simSlots.map((s) => [s.slot, s])),
    [simSlots],
  );

  const {
    combinationCount,
    deselectAll,
    getSlotItems,
    hasInventory,
    selectAll,
    selectedCount,
    setIncludeWeekly,
    shouldIncludeWeekly,
    toggleItem,
    totalAvailable,
  } = useSlotSelection(profile, slotGroups);

  const inventoryGridContent = hasInventory ? (
    SLOT_ORDER.map((slot) => {
      const items = getSlotItems(slot);

      if (items.length === 0) {
        return null;
      }

      return (
        <InventorySlotTable
          key={slot}
          items={items}
          onToggleItem={toggleItem}
          slot={slot}
        />
      );
    })
  ) : (
    <p className="py-8 text-center text-sm text-muted-foreground">
      {shared.noBagItems}
    </p>
  );

  return (
    <>
      {isSimActive ? (
        <InventorySimStats
          bestPermDps={bestPermDps}
          chunk={chunk}
          permsSimmed={permsSimmed}
          phase={phase}
          simsPerSec={simsPerSec}
          slotCount={simItems.size}
          totalPerms={totalPerms}
        />
      ) : (
        <InventorySelectionStats
          combinationCount={combinationCount}
          selectedCount={selectedCount}
          totalAvailable={totalAvailable}
        />
      )}

      {isSimActive ? (
        <InventorySimToolbar chunk={chunk} onReset={onResetSim} phase={phase} />
      ) : (
        <InventorySelectionToolbar
          onDeselectAll={deselectAll}
          onSelectAll={selectAll}
          onToggleIncludeWeekly={setIncludeWeekly}
          shouldIncludeWeekly={shouldIncludeWeekly}
        />
      )}

      <UrlTabs queryKey="view" defaultValue="paperdoll">
        <TabsList>
          <TabsTrigger value="paperdoll">{shared.tabPaperdoll}</TabsTrigger>
          <TabsTrigger value="grid">{shared.tabGrid}</TabsTrigger>
        </TabsList>

        <TabsContent value="paperdoll" className="space-y-4">
          {isSimActive ? (
            <SimCharacterView
              bestPermDps={bestPermDps}
              bestSet={bestSet}
              character={profile.character}
              dpsHistory={dpsHistory}
              expandedSlot={expandedSlot}
              flashSlots={flashSlots}
              onToggleSlot={onToggleExpandedSlot}
              phase={phase}
              slots={slotMap}
            />
          ) : (
            <EquipmentGrid profile={profile} />
          )}
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {isSimActive ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {simSlots.map((slotState) => (
                <SimSlotCard
                  key={slotState.slot}
                  slotState={slotState}
                  isRunning={phase === "running"}
                  isComplete={phase === "complete"}
                  isFlashing={flashSlots.has(slotState.slot)}
                />
              ))}
            </div>
          ) : (
            inventoryGridContent
          )}
        </TabsContent>
      </UrlTabs>

      {!isSimActive && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            {shared.back}
          </Button>
          <Button onClick={onNext} disabled={selectedCount === 0}>
            {shared.next}
          </Button>
        </div>
      )}
    </>
  );
}
