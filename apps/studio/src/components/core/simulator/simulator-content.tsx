"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { CharacterPanel } from "@/components/shared/character";
import { getPublicKeyBase64, useRuntimeStore } from "@/lib/node";
import { useSimulatorStore } from "@/lib/state";
import { Separator } from "@wowlab/shared/components/ui/separator";

import { SettingsPanel } from "./settings/settings-panel";
import { useSimSettings } from "./settings/use-sim-settings";
import { SimulatorChunksCard } from "./simulator-chunks-card";
import { SimulatorHeader } from "./simulator-header";
import { SimulatorIterationsCard } from "./simulator-iterations-card";
import { SimulatorRotationCard } from "./simulator-rotation-card";
import { SimulatorSimcImport } from "./simulator-simc-import";
import { useSimulatorProfile } from "./use-simulator-profile";

export function SimulatorContent() {
  const content = useIntlayer("simulatorPage");
  const chunks = useRuntimeStore((s) => s.chunks);
  const {
    groupedSettings,
    overrides,
    resetAll,
    resetSetting,
    setSetting,
    settings,
  } = useSimSettings();

  const iterations = useSimulatorStore((s) => s.iterations);
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const simcInput = useSimulatorStore((s) => s.simcInput);
  const specId = useSimulatorStore((s) => s.specId);

  const {
    handleClearAll,
    implementedSpecNames,
    isClearing,
    isSubmitting,
    parseError,
    profile,
    submitError,
    submitJob,
  } = useSimulatorProfile({
    overrides,
    rotationId,
    simcInput,
    specId,
  });

  const handleRun = useMemoizedFn(() => {
    submitJob({
      iterations,
      max_chunks: 0,
      priority: 0,
    });
  });

  const handleBenchmark = useMemoizedFn(() => {
    const publicKey = getPublicKeyBase64();

    if (!publicKey) {
      return;
    }

    submitJob({
      iterations: 1_000_000,
      max_chunks: 1,
      priority: 0,
    });
  });

  const overrideCount = Object.keys(overrides).length;
  const specName = specId
    ? (implementedSpecNames.get(specId) ??
      content.specFallback({ id: specId }).value)
    : null;
  const canRun = profile !== null && specId !== null && rotationId !== null;

  return (
    <div className="space-y-6">
      <SimulatorHeader
        canRun={canRun}
        isClearing={isClearing}
        isSubmitting={isSubmitting}
        onBenchmark={handleBenchmark}
        onClearAll={handleClearAll}
        onResetOverrides={resetAll}
        onRun={handleRun}
        overrideCount={overrideCount}
      />

      <Separator className="mb-6" />

      <SimulatorSimcImport parseError={parseError} simcInput={simcInput} />

      {profile && specId ? (
        <div className="mb-6">
          <CharacterPanel profile={profile} specId={specId} variant="summary" />
        </div>
      ) : null}

      {specId ? (
        <SimulatorRotationCard
          rotationId={rotationId}
          specId={specId}
          specName={specName}
        />
      ) : null}

      {specId ? <SimulatorIterationsCard iterations={iterations} /> : null}

      <SettingsPanel
        groupedSettings={groupedSettings}
        settings={settings}
        onSettingChange={setSetting}
        onSettingReset={resetSetting}
      />

      {submitError && (
        <p className="mt-4 text-xs text-destructive">{submitError}</p>
      )}

      <SimulatorChunksCard chunkCount={chunks.length} />
    </div>
  );
}
