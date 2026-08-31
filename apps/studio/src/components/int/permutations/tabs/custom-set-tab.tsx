"use client";

import type { GearSlot, PermutationSpace } from "wowlab-common";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { GameItem } from "@/components/shared/game";
import { useCommon } from "@/components/shared/wasm";
import { buildCustomSetExport, encodeResultExport } from "@/lib/parcel";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";

import type { Profile } from "../shared";

import {
  buildCustomSetRows,
  buildResultItemsFromPicks,
  type CustomSetRow,
  initialPicksFromSpace,
} from "./custom-set-helpers";

export type CustomSetTabProps = {
  common: CommonModule;
  profile: Profile;
  space: PermutationSpace;
  specName: string;
};

type CommonModule = ReturnType<typeof useCommon>;

export function CustomSetTab({
  common,
  profile,
  space,
  specName,
}: Readonly<CustomSetTabProps>) {
  const content = useIntlayer("permutationsPage");
  const slotLabels = useSlotLabels();
  const initialPicks = useMemo(() => initialPicksFromSpace(space), [space]);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  // Unselected slots follow `initialPicks`, so they re-track the equipped or first item when the profile changes.
  const picks = useMemo(
    () => ({ ...initialPicks, ...overrides }),
    [initialPicks, overrides],
  );

  const rows = useMemo(() => buildCustomSetRows(space, picks), [space, picks]);

  const handlePick = (slot: GearSlot, itemId: number) =>
    setOverrides((prev) => ({ ...prev, [slot]: itemId }));

  const handleResetEquipped = () => {
    setOverrides({});
    setError(null);
  };

  const buildPayload = () =>
    buildCustomSetExport({
      note: `${profile.character.name} · custom debug set`,
      picks: buildResultItemsFromPicks(rows),
      spec: specName,
    });

  const handleCopyToAddon = async () => {
    setError(null);

    try {
      await copy(encodeResultExport(common, buildPayload()));
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : String(error_));
    }
  };

  const handleCopyJson = async () => {
    setError(null);

    try {
      await copy(JSON.stringify(buildPayload(), null, 2));
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : String(error_));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {content.customSetTab.description}
      </p>

      <TableCard<CustomSetRow>
        title={content.customSetTab.title}
        rowKey={(row) => row.slot}
        data={rows}
        headerActions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleResetEquipped}>
              {content.customSetTab.resetToEquipped}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyJson}>
              <CopyIcon className="size-4" />
              {content.customSetTab.copyJson}
            </Button>
            <Button size="sm" onClick={handleCopyToAddon}>
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
              {copied
                ? content.customSetTab.copyToAddonDone
                : content.customSetTab.copyToAddon}
            </Button>
          </div>
        }
        columns={[
          {
            cell: (row) => (
              <span className="font-medium">{slotLabels[row.slot]}</span>
            ),
            header: content.customSetTab.headerSlot.value,
          },
          {
            cell: (row) => (
              <Select
                value={String(row.current)}
                onValueChange={(v) => handlePick(row.slot, Number(v))}
              >
                <SelectTrigger className="min-w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {row.candidates.map((c) => (
                    <SelectItem key={c.itemId} value={String(c.itemId)}>
                      <span className="font-mono tabular-nums">{c.itemId}</span>
                      <span className="text-muted-foreground">
                        ({c.source})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
            header: content.customSetTab.headerPick.value,
          },
          {
            cell: (row) => <GameItem id={row.current} />,
            header: content.customSetTab.headerPreview.value,
          },
          {
            cell: (row) => {
              const picked = row.candidates.find(
                (c) => c.itemId === row.current,
              );

              return (
                <span className="font-mono text-xs text-muted-foreground">
                  {picked && picked.bonusIds.length > 0
                    ? content.customSetTab.bonusIds({
                        ids: picked.bonusIds.join(","),
                      })
                    : "—"}
                </span>
              );
            },
            header: content.customSetTab.headerBonusIds.value,
          },
        ]}
      />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
