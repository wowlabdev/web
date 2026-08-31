"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { Condition, ConditionEditorCtx } from "../types";

import { KeySelector } from "./key-selector";

type FieldReadEditorProps = {
  node: Extract<Condition, { type: "read" }>;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
};

export function FieldReadEditor({
  ctx,
  node,
  onChange,
}: Readonly<FieldReadEditorProps>) {
  const content = useIntlayer("rotationEditor");
  const { auraSlugs, descriptors, resourceNames, spellSlugs } = ctx;

  const domains = useMemo(() => {
    const set = new Set<string>();

    for (const d of descriptors) {
      set.add(d.domain);
    }

    return [...set].sort((a, b) => a.localeCompare(b));
  }, [descriptors]);

  const fieldsForDomain = useMemo(
    () => descriptors.filter((d) => d.domain === node.domain),
    [descriptors, node.domain],
  );

  const selected = useMemo(
    () =>
      descriptors.find((d) => d.domain === node.domain && d.name === node.name),
    [descriptors, node.domain, node.name],
  );

  const needsKey = selected?.slot_kind === "keyed";
  const keyDomain = selected?.key_domain;

  const keyOptions = useMemo(() => {
    if (keyDomain === "spell") {
      return spellSlugs;
    }

    if (keyDomain === "aura") {
      return auraSlugs;
    }

    if (keyDomain === "resource") {
      return resourceNames;
    }

    return [];
  }, [keyDomain, spellSlugs, auraSlugs, resourceNames]);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Select
        value={node.domain}
        onValueChange={(domain) => {
          const first = descriptors.find((d) => d.domain === domain);

          onChange({
            ...node,
            domain,
            key: undefined,
            name: first?.name ?? "",
            on: undefined,
          });
        }}
      >
        <SelectTrigger size="sm" className="h-7 w-28 text-xs">
          <SelectValue placeholder={content.fieldReadDomainPlaceholder.value} />
        </SelectTrigger>
        <SelectContent>
          {domains.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={node.name}
        onValueChange={(name) =>
          onChange({ ...node, key: undefined, name, on: undefined })
        }
      >
        <SelectTrigger size="sm" className="h-7 w-32 text-xs">
          <SelectValue placeholder={content.fieldReadFieldPlaceholder.value} />
        </SelectTrigger>
        <SelectContent>
          {fieldsForDomain.map((d) => (
            <SelectItem key={d.name} value={d.name}>
              {d.name}
              <span className="ml-1 text-muted-foreground">
                ({d.field_type.toLowerCase()})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsKey && (
        <KeySelector
          value={node.key ?? ""}
          options={keyOptions}
          onChange={(key) => onChange({ ...node, key })}
        />
      )}

      {node.domain === "aura" && (
        <Select
          value={node.on ?? "player"}
          onValueChange={(on) =>
            onChange({ ...node, on: on as "player" | "target" })
          }
        >
          <SelectTrigger size="sm" className="h-7 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">{content.fieldReadOnPlayer}</SelectItem>
            <SelectItem value="target">{content.fieldReadOnTarget}</SelectItem>
          </SelectContent>
        </Select>
      )}

      {selected && (
        <span className="text-xs text-muted-foreground">
          {selected.description}
        </span>
      )}
    </div>
  );
}
