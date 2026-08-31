import { getSection } from "./figures";

export type ContentTable = {
  caption: string;
  description: string;
  id: string;
  page: string;
};

function tbl(
  id: string,
  caption: string,
  page: string,
  description: string,
): ContentTable {
  return { caption, description, id, page };
}

/* eslint-disable perfectionist/sort-objects -- insertion order assigns stable table numbers */
// prettier-ignore
export const tables: Record<string, ContentTable> = {
  "bible-sections": tbl(
    "bible-sections",
    "Bible Sections",
    "introduction",
    "Overview of the major sections of the bible with links and brief descriptions.",
  ),

  // 01 - Overview
  "components-overview": tbl(
    "components-overview",
    "Platform Components",
    "overview/architecture",
    "Each top-level component: where it runs, what it is, and why it lives there — studio, landing, Engine, sentinel, beacon, Nodes, NATS, Redis, headscale, alloy, and Game Data.",
  ),

  // 02 - Game Data
  "gamedata-dbc-loaders": tbl(
    "gamedata-dbc-loaders",
    "DBC CSV Loaders",
    "game-data/dbc-overview",
    "The three generic loaders behind DbcData::load_all — load_by_id, load_by_fk, load_one_by_fk — how each keys rows and the resulting map shape.",
  ),
  "gamedata-spell-fields": tbl(
    "gamedata-spell-fields",
    "SpellDataFlat Field Groups",
    "game-data/spell-data",
    "The logical field groups of SpellDataFlat (identity/text, timing/cost, range/AoE, school/coefficient, interrupts, duration/empower, vec columns, aura props, RPPM/labels) with representative fields.",
  ),
  "gamedata-scaling-tables": tbl(
    "gamedata-scaling-tables",
    "ItemScalingData Tables",
    "game-data/items-and-scaling",
    "The seven game.* tables folded into ItemScalingData by from_flat, each with its grouping key.",
  ),
  "gamedata-resolvers": tbl(
    "gamedata-resolvers",
    "DataResolver Implementations",
    "game-data/data-resolution",
    "The five implementations of the DataResolver port — SupabaseResolver, LocalCsvResolver, JsResolver, OverlayResolver, InMemoryResolver — their source and where each runs.",
  ),
  "gamedata-manifest-sections": tbl(
    "gamedata-manifest-sections",
    "Spec Manifest Sections",
    "game-data/codegen",
    "The sections of a per-spec manifest-schema Manifest (spec, resource, auras, spells, auto_attacks, talents, hero_talents, metric_keys, rotation_schema) and their types.",
  ),

  // 03 - Engine
  "event-variants": tbl(
    "event-variants",
    "Event Variants",
    "engine/event-system",
    "All eight Event variants of the simulation loop (PlayerReady, OffGcdReady, CastStart, CastComplete, AuraTick, AuraExpire, CooldownReady, AutoAttack) with payload and meaning.",
  ),
  "buff-effect-variants": tbl(
    "buff-effect-variants",
    "BuffEffect Variants",
    "engine/combat-formulas",
    "Representative BuffEffect variants an aura can contribute, classified into finalized consumer families and folded through actor-revision BuffTotals caches.",
  ),
  "periodic-kind-variants": tbl(
    "periodic-kind-variants",
    "PeriodicKind Variants",
    "engine/auras",
    "The five PeriodicKind variants dispatched on each AuraTick: DamageAp, DamageSp, ResourceGain, ResourceDrain, ApplyAura.",
  ),
  "impact-proc-fields": tbl(
    "impact-proc-fields",
    "ImpactProc Fields",
    "engine/procs",
    "The fields of the ImpactProc struct (chance, fire, spell_filter, periodic_only, skip_periodic, crit_only) that fire_impact_procs uses to decide impact-triggered proc eligibility.",
  ),

  // 04 - Distribution
  "simulate-intent-entries": tbl(
    "simulate-intent-entries",
    "Engine Entry Functions",
    "distribution/orchestration",
    "The four engine-application entry functions — simulate_intent, simulate_intent_request, simulate_intent_with_trace, build_handler — and which runner each drives.",
  ),
  "wasm-exports": tbl(
    "wasm-exports",
    "Engine WASM Exports",
    "distribution/wasm-boundary",
    "The wasm-bindgen exports of the engine crate by module (runSimulation, runSimulationWithProgress, runIterationTrace, metadata, rotation validation), sync vs async, and purpose.",
  ),
  "centrifugo-channels": tbl(
    "centrifugo-channels",
    "Centrifugo Channel Namespace",
    "distribution/realtime",
    "The beacon channels (chunks, nodes, jobs prefixes) with direction, publisher, and subscriber, each cited to its publish or subscribe call site.",
  ),
  "completion-outcomes": tbl(
    "completion-outcomes",
    "CompletionOutcome Variants",
    "distribution/hosted-compute",
    "The four outcomes of runtime.complete() — Accepted, Idempotent, Conflict, Stale — and the HTTP status each maps to.",
  ),
  "fly-apps": tbl(
    "fly-apps",
    "Fly Applications",
    "distribution/deployment",
    "The six Fly apps in region lhr (sentinel, beacon, nats, headscale, alloy, node) with image, internal port, and role.",
  ),

  // 05 - Portal
  "portal-simulator-slice": tbl(
    "portal-simulator-slice",
    "Redux Simulator Slice",
    "portal/state-management",
    "The fields of the single Redux Toolkit simulator slice that persist across the import, configure, and results steps, with their types and purpose.",
  ),
  "portal-mdx-components": tbl(
    "portal-mdx-components",
    "Bible MDX Components",
    "portal/content-system",
    "The custom MDX tags registered in studioMdxComponents (Figure, BibleTable, Term, Cite, and the index-list components) and what each renders.",
  ),
};
/* eslint-enable perfectionist/sort-objects */

export function getTableNumber(id: string): number {
  return Object.keys(tables).indexOf(id) + 1;
}

export function groupBySection(
  list: ContentTable[],
): Record<string, ContentTable[]> {
  const result: Record<string, ContentTable[]> = {};

  for (const t of list) {
    const section = getSection(t.page);

    result[section] ??= [];
    result[section].push(t);
  }

  return result;
}
