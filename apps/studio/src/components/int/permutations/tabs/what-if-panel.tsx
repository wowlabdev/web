"use client";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Input } from "@wowlab/shared/components/ui/input";

import type { FormatNumber } from "../shared";
const SLOT_MAX = 16;
const OPTS_MIN = 1;
const OPTS_MAX = 20;
const DEFAULT_ENCHANTS_PER_SLOT = 4;
const DEFAULT_GEMS_PER_SLOT = 3;

type NumericLabeledInputProps = {
  label: string;
  max?: number;
  min?: number;
  onChange: (n: number) => void;
  value: number;
};
type WhatIfPanelProps = {
  base: number;
  fmtNumber: FormatNumber;
};

export function WhatIfPanel({ base, fmtNumber }: Readonly<WhatIfPanelProps>) {
  const content = useIntlayer("permutationsPage");
  const [enchantSlots, setEnchantSlots] = useState(0);
  const [enchantsPerSlot, setEnchantsPerSlot] = useState(
    DEFAULT_ENCHANTS_PER_SLOT,
  );
  const [gemSlots, setGemSlots] = useState(0);
  const [gemsPerSlot, setGemsPerSlot] = useState(DEFAULT_GEMS_PER_SLOT);
  const enchantMul = enchantsPerSlot ** enchantSlots;
  const gemMul = gemsPerSlot ** gemSlots;
  const total = base * enchantMul * gemMul;
  const inputs: Array<
    {
      key: string;
    } & NumericLabeledInputProps
  > = [
    {
      key: "enchantSlots",
      label: content.whatIfPanel.enchantSlots.value,
      max: SLOT_MAX,
      onChange: setEnchantSlots,
      value: enchantSlots,
    },
    {
      key: "enchantsPerSlot",
      label: content.whatIfPanel.perSlot.value,
      max: OPTS_MAX,
      min: OPTS_MIN,
      onChange: setEnchantsPerSlot,
      value: enchantsPerSlot,
    },
    {
      key: "gemSlots",
      label: content.whatIfPanel.gemSlots.value,
      max: SLOT_MAX,
      onChange: setGemSlots,
      value: gemSlots,
    },
    {
      key: "gemsPerSlot",
      label: content.whatIfPanel.perSlot.value,
      max: OPTS_MAX,
      min: OPTS_MIN,
      onChange: setGemsPerSlot,
      value: gemsPerSlot,
    },
  ];

  return (
    <div className="rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
      <p className="mb-2 text-sm font-medium">{content.whatIfPanel.title}</p>
      <div className="mb-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {inputs.map(({ key, ...input }) => (
          <NumericLabeledInput key={key} {...input} />
        ))}
      </div>
      <p className="font-mono">
        {fmtNumber(base)}
        {enchantSlots > 0
          ? ` ${content.whatIfPanel.enchantsLine({ count: enchantMul, formattedCount: fmtNumber(enchantMul) }).value}`
          : null}
        {gemSlots > 0
          ? ` ${content.whatIfPanel.gemsLine({ count: gemMul, formattedCount: fmtNumber(gemMul) }).value}`
          : null}
        {" = "}
        <span className="font-semibold">{fmtNumber(total)}</span>
      </p>
    </div>
  );
}

function NumericLabeledInput({
  label,
  max = 100,
  min = 0,
  onChange,
  value,
}: Readonly<NumericLabeledInputProps>) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full"
      />
    </label>
  );
}
