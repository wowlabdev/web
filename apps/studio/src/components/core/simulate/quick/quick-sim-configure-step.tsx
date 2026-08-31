"use client";

import type { Profile } from "wowlab-common";

import { ShieldIcon, SwordsIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { IterationsField } from "@/components/core/simulate/iterations-field";
import { RotationSelectField } from "@/components/core/simulate/rotation-select-field";
import { GameItem } from "@/components/shared/game";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Button } from "@wowlab/shared/components/ui/button";

type QuickSimConfigureStepProps = {
  canSubmit: boolean;
  isLoadingRotations: boolean;
  isSubmitting: boolean;
  iterations: number;
  onBack: () => void;
  onIterationsChange: (value: number) => void;
  onRotationIdChange: (value: string) => void;
  onSubmit: () => void;
  profile: Profile | null;
  rotationId: string | null;
  rotations: { id: string; name: string }[] | undefined;
  specId: number | null;
  specName: string | null;
  submitError: string | null;
};

export function QuickSimConfigureStep({
  canSubmit,
  isLoadingRotations,
  isSubmitting,
  iterations,
  onBack,
  onIterationsChange,
  onRotationIdChange,
  onSubmit,
  profile,
  rotationId,
  rotations,
  specId,
  specName,
  submitError,
}: Readonly<QuickSimConfigureStepProps>) {
  const shared = useIntlayer("simulateShared");
  const quick = useIntlayer("simulateQuick");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<SwordsIcon className="size-4" />}
          value={specName ?? quick.specFallback.value}
          title={quick.specTitle.value}
          changePercentage={
            profile
              ? quick.specSubtitle({
                  level: profile.character.level,
                  name: profile.character.name,
                })
              : ""
          }
        />
        <StatCard
          icon={<ShieldIcon className="size-4" />}
          value={String(profile?.equipment.length ?? 0)}
          title={quick.equippedItemsTitle.value}
          changePercentage={quick.equippedItemsSubtitle.value}
        />
      </div>

      {profile && profile.equipment.length > 0 && (
        <TableCard
          title={quick.equipmentTitle.value}
          columns={[
            {
              cell: (row: { id: number; slot: string }) => (
                <span className="text-xs text-muted-foreground">
                  {row.slot}
                </span>
              ),
              className: "w-24",
              header: quick.headerSlot.value,
            },
            {
              cell: (row: { id: number; slot: string }) => (
                <GameItem id={row.id} />
              ),
              header: quick.headerItem.value,
            },
          ]}
          data={profile.equipment.map((item) => ({
            id: item.id,
            slot: item.slot,
          }))}
          rowKey={(row: { id: number; slot: string }) =>
            `${row.slot}-${row.id}`
          }
        />
      )}

      {specId ? (
        <RotationSelectField
          isLoading={isLoadingRotations}
          label={quick.rotationLabel.value}
          loadingLabel={quick.loadingRotations.value}
          noRotationsLabel={quick.noRotations({ spec: specName ?? "" }).value}
          onRotationIdChange={onRotationIdChange}
          placeholder={quick.rotationPlaceholder.value}
          rotationId={rotationId}
          rotations={rotations}
        />
      ) : null}

      <IterationsField
        hint={quick.iterationsHint.value}
        iterations={iterations}
        label={quick.iterationsLabel.value}
        onIterationsChange={onIterationsChange}
      />

      {submitError && <p className="text-xs text-destructive">{submitError}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {shared.back}
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting} disabled={!canSubmit}>
          {isSubmitting ? quick.submitting : quick.runSimulation}
        </Button>
      </div>
    </>
  );
}
