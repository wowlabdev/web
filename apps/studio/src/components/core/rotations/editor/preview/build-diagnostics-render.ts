import type { MarkdownDoc, SpecIntrospection, SpellInfo } from "wowlab-common";
import type { ValidationError, ValidationWarning } from "wowlab-engine";

import type { EditorScript } from "../store-types";
import type { ActionEntry } from "../types";

export function appendResolvedSpells(
  doc: MarkdownDoc,
  script: EditorScript,
  intro: SpecIntrospection | null,
): void {
  const spellSlugs = collectSpellSlugs(script);

  if (spellSlugs.length === 0) {
    return;
  }

  const introSpellMap = new Map<string, SpellInfo>();

  if (intro) {
    for (const s of intro.spells) {
      introSpellMap.set(s.slug, s);
    }
  }

  doc.blank();
  doc.h2("Resolved spells");

  for (const slug of spellSlugs) {
    const info = introSpellMap.get(slug);

    if (!info) {
      doc.bullet(`${slug}: UNRESOLVED (not in spec catalog)`);
      continue;
    }

    doc.bullet(`${slug} (${info.name}): ${spellParts(info).join(" ")}`);
  }
}

export function renderValidationError(err: ValidationError): string {
  switch (err.type) {
    case "actionExpansionLimitExceeded": {
      return `[actionExpansionLimitExceeded] expanded to ${err.actions} actions (max ${err.max})`;
    }

    case "circularReference": {
      return `[circularReference] ${err.path.join(" -> ")}`;
    }

    case "duplicateList": {
      return `[duplicateList] ${err.name}`;
    }

    case "duplicateVariable": {
      return `[duplicateVariable] ${err.name}`;
    }

    case "emptyActionList": {
      return `[emptyActionList] ${err.list_name}`;
    }

    case "invalidExpression": {
      const loc = locationSuffix(err.list_name, err.action_index, err.slug);

      return `[invalidExpression] ${err.message}${loc}`;
    }

    case "maxDepthExceeded": {
      return `[maxDepthExceeded] condition nested ${err.depth} deep (max ${err.max})`;
    }

    case "typeMismatch": {
      const loc = locationSuffix(err.list_name, err.action_index);

      return `[typeMismatch] ${err.name} ${err.op}: expected ${err.expected}, got ${err.got}${loc}`;
    }

    case "undefinedList": {
      return `[undefinedList] ${err.name}`;
    }

    case "undefinedVariable": {
      return `[undefinedVariable] ${err.name}`;
    }

    case "unknownField": {
      return `[unknownField] ${err.domain}.${err.name}`;
    }

    case "unsupportedSyntax": {
      return `[unsupportedSyntax] ${err.construct}`;
    }
  }
}

export function renderValidationWarning(w: ValidationWarning): string {
  switch (w.type) {
    case "constantCondition": {
      return `[constantCondition] ${w.location} always ${w.value}`;
    }

    case "unusedList": {
      return `[unusedList] ${w.name}`;
    }

    case "unusedVariable": {
      return `[unusedVariable] ${w.name}`;
    }
  }
}

function collectSpellSlugs(script: EditorScript): string[] {
  const slugs = new Set<string>();

  visitActions(script.actions, slugs);

  for (const list of Object.values(script.lists)) {
    visitActions(list, slugs);
  }

  return [...slugs].sort((a, b) => a.localeCompare(b));
}

function locationSuffix(
  listName?: string,
  actionIndex?: number,
  slug?: string,
): string {
  const parts: string[] = [];

  if (listName) {
    parts.push(`list=${listName}`);
  }

  if (actionIndex != null) {
    parts.push(`action=${actionIndex}`);
  }

  if (slug) {
    parts.push(`slug=${slug}`);
  }

  return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

function spellParts(info: SpellInfo): string[] {
  const parts: string[] = [
    `id=${info.spell_id}`,
    `cast=${info.cast_time_ms}ms`,
    `gcd=${info.gcd_ms}ms`,
  ];

  if (info.off_gcd) {
    parts.push("offGcd");
  }

  if (info.resource_cost !== 0 || info.secondary_resource_cost !== 0) {
    parts.push(`cost=${info.resource_cost}/${info.secondary_resource_cost}`);
  }

  if (info.resource_gain !== 0 || info.secondary_resource_gain !== 0) {
    parts.push(`gain=${info.resource_gain}/${info.secondary_resource_gain}`);
  }

  if (info.cooldown) {
    parts.push(
      `cd=${info.cooldown.duration_secs}s×${info.cooldown.max_charges}`,
    );
  }

  if (info.applies_aura_id != null) {
    parts.push(`applies=${info.applies_aura_id}`);
  }

  parts.push(`damage=${info.damage.kind.type}`);

  return parts;
}

function visitActions(actions: ActionEntry[], slugs: Set<string>): void {
  for (const action of actions) {
    if (action.spell) {
      slugs.add(action.spell);
    }
  }
}
