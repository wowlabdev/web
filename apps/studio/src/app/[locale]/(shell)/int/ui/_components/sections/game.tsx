"use client";

import type { ImplementedSpecInfo } from "wowlab-common";

import { useMemo, useState } from "react";

import {
  AURA_FIXTURES,
  ITEM_FIXTURES,
  MISSING_ID,
  SPEC_FIXTURES,
  SPELL_FIXTURES,
} from "@/components/int/__fixtures__/game-fixtures";
import {
  GameAura,
  GameItem,
  GameLabel,
  GameSpec,
  GameSpell,
  GameTooltip,
  GameTooltipSkeleton,
  GameTooltipWrapper,
  SpecPicker,
} from "@/components/shared/game";
import { QueryIsland } from "@/components/shared/islands";
import { useCommon, useEngine, WasmBoundary } from "@/components/shared/wasm";
import { parseImplementedSpecs } from "@/lib/wasm/api";
import { Skeleton } from "@wowlab/shared/components/ui/skeleton";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

export function GameSection() {
  return (
    <DemoSection id="game" title="Game">
      <DemoSubsection title="Inline Labels (hover for tooltip)">
        <DemoBox>
          {ITEM_FIXTURES.map((f) => (
            <GameItem key={f.id} id={f.id} size="md" />
          ))}
        </DemoBox>
        <DemoBox>
          {SPELL_FIXTURES.map((f) => (
            <GameSpell key={f.id} id={f.id} size="md" />
          ))}
        </DemoBox>
        <DemoBox>
          {AURA_FIXTURES.map((f) => (
            <GameAura key={f.id} size="md" spellId={f.id} />
          ))}
        </DemoBox>
        <DemoBox>
          {SPEC_FIXTURES.map((f) => (
            <GameSpec key={f.id} size="md" specId={f.id} />
          ))}
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Item Tooltips">
        <DemoBox className="items-start">
          {ITEM_FIXTURES.map((f) => (
            <GameTooltip key={f.id} id={f.id} kind="item" />
          ))}
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Spell Tooltips">
        <DemoBox className="items-start">
          {SPELL_FIXTURES.map((f) => (
            <GameTooltip key={f.id} id={f.id} kind="spell" />
          ))}
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Aura Tooltips">
        <DemoBox className="items-start">
          {AURA_FIXTURES.map((f) => (
            <GameTooltip key={f.id} id={f.id} kind="aura" />
          ))}
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Loading Skeletons">
        <DemoBox className="items-start">
          <GameTooltipSkeleton kind="item" />
          <GameTooltipSkeleton kind="spell" />
        </DemoBox>
        <DemoBox>
          <GameLabel fallback="" loading size="sm" />
          <GameLabel fallback="" loading size="md" />
          <GameLabel fallback="" loading size="lg" />
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Hover Loading Skeleton">
        <DemoBox>
          <GameTooltipWrapper tooltip={<GameTooltipSkeleton kind="item" />}>
            <span className="cursor-default rounded-sm border px-2 py-1 text-sm">
              Hover: item skeleton
            </span>
          </GameTooltipWrapper>
          <GameTooltipWrapper tooltip={<GameTooltipSkeleton kind="spell" />}>
            <span className="cursor-default rounded-sm border px-2 py-1 text-sm">
              Hover: spell skeleton
            </span>
          </GameTooltipWrapper>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Not Found (fallback text)">
        <DemoBox>
          <GameItem id={MISSING_ID} size="md" />
          <GameSpell id={MISSING_ID} size="md" />
          <GameSpec size="md" specId={MISSING_ID} />
        </DemoBox>
        <DemoBox className="items-start">
          <GameTooltip id={MISSING_ID} kind="item" />
          <GameTooltip id={MISSING_ID} kind="spell" />
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Spec Picker">
        <DemoBox>
          <QueryIsland>
            <WasmBoundary
              fallback={<Skeleton className="h-52 w-full max-w-md" />}
            >
              <SpecPickerDemo />
            </WasmBoundary>
          </QueryIsland>
        </DemoBox>
      </DemoSubsection>
    </DemoSection>
  );
}

function SpecPickerDemo() {
  const common = useCommon();
  const engine = useEngine();
  const [specId, setSpecId] = useState<null | number>(null);

  const specs = useMemo(
    () =>
      parseImplementedSpecs(
        common,
        engine.getImplementedSpecs(),
      ) as ImplementedSpecInfo[],
    [common, engine],
  );

  return <SpecPicker onChange={setSpecId} specs={specs} value={specId} />;
}
