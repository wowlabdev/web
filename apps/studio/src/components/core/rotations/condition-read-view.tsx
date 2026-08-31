"use client";

import type { ReactElement } from "react";

import { useIntlayer } from "next-intlayer";

import type { Condition, SpecSpellMap } from "./rotation-view-types";

import { formatSlug } from "./format-slug";
import { RotationAura, RotationSpell } from "./rotation-spell";

type ConditionReadViewProps = {
  condition: Extract<Condition, { type: "read" }>;
  content: ReturnType<typeof useIntlayer<"rotations">>;
  specMap: SpecSpellMap | null;
};

export function ConditionReadView({
  condition,
  content,
  specMap,
}: Readonly<ConditionReadViewProps>): ReactElement {
  const { domain, key, name, on } = condition;

  if (domain === "aura" && key) {
    const suffix = auraSuffix(name, on, content);

    return <RotationAura slug={key} specMap={specMap} suffix={suffix} />;
  }

  if ((domain === "cooldown" || domain === "spell") && key) {
    const suffix = spellSuffix(domain, name, content);

    return (
      <>
        <RotationSpell slug={key} specMap={specMap} />
        <span>{suffix}</span>
      </>
    );
  }

  if (domain === "resource" && key) {
    return renderResourceRead(key, name);
  }

  const keySuffix = key ? `(${formatSlug(key)})` : "";

  return <span>{`${domain}.${name}${keySuffix}`}</span>;
}

function auraSuffix(
  name: string,
  on: string | undefined,
  content: ReturnType<typeof useIntlayer<"rotations">>,
): string {
  const targetPrefix =
    on === "target" ? `${content.conditionTargetPrefix.value} ` : "";

  switch (name) {
    case "is_active": {
      return `${targetPrefix}${content.conditionAuraActive.value}`;
    }

    case "is_inactive": {
      return `${targetPrefix}${content.conditionAuraInactive.value}`;
    }

    case "stacks": {
      return content.conditionAuraStacks.value;
    }

    default: {
      return `aura.${name}`;
    }
  }
}

function renderResourceRead(key: string, name: string): ReactElement {
  if (name === "pct") {
    return <span>{`${formatSlug(key)}%`}</span>;
  }

  if (name === "current") {
    return <span>{formatSlug(key)}</span>;
  }

  return <span>{`${formatSlug(key)}.${name}`}</span>;
}

function spellSuffix(
  domain: string,
  name: string,
  content: ReturnType<typeof useIntlayer<"rotations">>,
): string {
  if (name === "is_ready") {
    return content.conditionCooldownReady.value;
  }

  if (name === "is_usable") {
    return content.conditionSpellUsable.value;
  }

  return `${domain}.${name}`;
}
