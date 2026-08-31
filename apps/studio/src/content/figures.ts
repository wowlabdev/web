export type Figure = {
  caption: string;
  description: string;
  id: string;
  page: string;
};

function fig(
  id: string,
  caption: string,
  page: string,
  description: string,
): Figure {
  return { caption, description, id, page };
}

export const SECTIONS: Record<string, string> = {
  compendium: "Compendium",
  distribution: "Distribution",
  engine: "Engine",
  "game-data": "Game Data",
  overview: "Overview",
  portal: "Portal",
};

/* eslint-disable perfectionist/sort-objects -- insertion order assigns stable figure numbers */
// prettier-ignore
export const figures: Record<string, Figure> = {
  // 01 - Overview
  "solution-architecture": fig(
    "solution-architecture",
    "Solution Architecture Overview",
    "overview/motivation",
    "Four major subsystems (Game Data, Simulation Engine, Portal, Hosted Pool) and their data flow from DBC files through to simulation results.",
  ),
  "sys-context": fig(
    "sys-context",
    "System Context",
    "overview/architecture",
    "The whole platform at one zoom level: Browser, Edge (Cloudflare), Game Data (Supabase), Engine, sentinel, beacon, Nodes, and supporting Infra, with the in-browser WASM path and the hosted node path shown as the two branches that run the same engine.",
  ),
  "job-lifecycle": fig(
    "job-lifecycle",
    "Hosted Job Lifecycle",
    "overview/architecture",
    "A hosted simulation end to end: studio creates a job in Supabase, a NOTIFY on pending_job wakes the sentinel scheduler, chunks publish to chunks:{node}, the node runs simulate_intent and POSTs a signed completion to /chunks/complete, the sentinel finalizes and publishes progress on jobs:{id}, and studio renders.",
  ),
  "crate-graph": fig(
    "crate-graph",
    "Rust Crate Dependency Graph",
    "overview/architecture",
    "Expands the Engine box of the system context: the engine workspace split by clean-architecture layers (ports, domain, combat, sim, content, application, adapter-data) and the node and sentinel host shells that drive it.",
  ),
  "language-decision-matrix": fig(
    "language-decision-matrix",
    "Language Decision Matrix",
    "overview/language-evaluation",
    "Decision tree showing key requirements and how each candidate language meets or fails them.",
  ),
  "rotation-compilation-pipeline": fig(
    "rotation-compilation-pipeline",
    "Rotation Compilation Pipeline",
    "overview/rotation-language",
    "Full path from JSON APL through one prepared rotation to portable bytecode for WASM and native execution or explicitly selected LLVM JIT machine code, with structural evaluation isolated to decision tracing.",
  ),
  "scripting-language-evolution": fig(
    "scripting-language-evolution",
    "Scripting Language Evolution",
    "overview/rotation-language",
    "Progression from Lua to Rhai to custom DSL to expression trees to JIT-compiled APL with rejection reasons at each stage.",
  ),

  // 02 - Game Data
  "data-resolution": fig(
    "data-resolution",
    "Data Resolution Pipeline",
    "game-data/data-resolution",
    "Expands the Game Data box of the system context: the three sources (CSV, Supabase, JS bridge) behind the DataResolver port, the DBC-to-flat transform, and the resolve_game_data pass that folds them into ResolvedGameData.",
  ),
  "cache-layers": fig(
    "cache-layers",
    "Game Data Cache Layers",
    "game-data/data-resolution",
    "Expands the GameDataCache box of the data-resolution pipeline: the L1 Moka memory, L2 disk JSON, and L3 PostgREST read-through path, plus patch-version invalidation.",
  ),
  "codegen-pipeline": fig(
    "codegen-pipeline",
    "Spec Codegen Pipeline",
    "game-data/codegen",
    "Expands the build-time content facet of the Engine box: per-spec manifests/*.toml validated against manifest-schema, compiled by codegen-cli into engine-content/src/generated, whose builder functions read ResolvedGameData at bootstrap.",
  ),

  // 03 - Engine
  "sim-pipeline": fig(
    "sim-pipeline",
    "Simulation Pipeline",
    "engine/discrete-event-simulation",
    "Expands the Engine box of the system context: simulate_intent bootstraps (descriptor, gear to stats, resolve_game_data, build handler), then run_chunk drives SimEngine.run per iteration and accumulates telemetry into a ChunkReport.",
  ),
  "event-loop-state": fig(
    "event-loop-state",
    "SimEngine Event Loop",
    "engine/event-system",
    "Expands the SimEngine.run box of the simulation pipeline: the eight Event variants and the scheduling transitions between them, with the encounter-end and event-budget terminals.",
  ),
  "timing-wheel": fig(
    "timing-wheel",
    "Timing Wheel Event Queue",
    "engine/event-system",
    "Expands the EventQueue box of the simulation pipeline: 32768 slots of 32 ms with a bitmap scan, an arena and free list for nodes, and an overflow bucket reinserted on wheel rotation.",
  ),
  "rotation-compile": fig(
    "rotation-compile",
    "Rotation Compilation (Portable and JIT)",
    "engine/rotation-compiler",
    "Expands the build-handler box of the simulation pipeline: JSON is validated once into PreparedRotation, then the shared lowerer emits either portable bytecode or explicitly selected LLVM JIT code. WASM uses portable bytecode; only explicit decision tracing uses the private structural reference evaluator.",
  ),
  "dense-buffer": fig(
    "dense-buffer",
    "DenseBuffer Slot Model",
    "engine/rotation-compiler",
    "Expands the DenseBuffer box of the rotation compiler: singleton slots (player, combat, pet) and keyed maps (cooldown, aura, resource, spell, ...) as repr(C) 8-aligned structs in one flat byte buffer, indexed by the FieldDescriptor inventory.",
  ),
  "process-cast": fig(
    "process-cast",
    "process_cast Pipeline",
    "engine/cast-pipeline",
    "Expands the CastComplete handling of the SimEngine loop: the thirteen steps of process_cast from spell lookup through resources, channel branch, cooldown, damage, aura, cooldown reduction, hooks, stealth, and history.",
  ),
  "damage-pipeline": fig(
    "damage-pipeline",
    "Damage Calculation Pipeline",
    "engine/combat-formulas",
    "Expands the deal_damage step of process_cast: DamageCalc::calculate in order — weapon roll, raw (base plus coefficient times attack power), crit, versatility, armor mitigation, damage multiplier, mastery.",
  ),
  "aura-lifecycle": fig(
    "aura-lifecycle",
    "Aura Lifecycle",
    "engine/auras",
    "Expands the apply_aura step of process_cast: the aura state machine through fresh application, pandemic refresh (30% carryover), periodic tick rescheduling, snapshotting, and expiry.",
  ),
  "metrics-pipeline": fig(
    "metrics-pipeline",
    "Telemetry and Metrics Pipeline",
    "engine/metrics",
    "Expands the telemetry box of the simulation pipeline: per-iteration TelemetrySink events fold into the TelemetryAccumulator (per-second buckets, representative iteration, running stats), merge across chunks, and encode to a protobuf ChunkTelemetry.",
  ),

  // 04 - Distribution
  "chunk-lifecycle": fig(
    "chunk-lifecycle",
    "Chunk Execution Lifecycle",
    "distribution/orchestration",
    "Expands the run_chunk loop box of the simulation pipeline: a chunk moves Assigned to Bootstrapped to Running, then to ConvergedEarly (adaptive target_error) or Exhausted to Reported, or Failed on event-budget overflow.",
  ),
  "wasm-boundary": fig(
    "wasm-boundary",
    "WASM Boundary",
    "distribution/wasm-boundary",
    "Expands the Browser box of the system context: the engine and common crates compiled to wasm-bindgen exports, loaded in a Comlink web worker, with JsResolver adapting the JS resolver (in-memory, IndexedDB, Supabase).",
  ),
  "worker-pool-state": fig(
    "worker-pool-state",
    "Browser Worker Pool",
    "distribution/wasm-boundary",
    "Expands the web-worker box of the WASM boundary: a pool slot from initializing to idle to busy (fetching, simulating, signing, submitting) and back, with watchdog timeout to restart.",
  ),
  "realtime-topology": fig(
    "realtime-topology",
    "Realtime Topology",
    "distribution/realtime",
    "Expands the beacon box of the system context: sentinel and clients over Centrifugo, with NATS as the broker and Redis as the presence manager, the chunks/nodes/jobs channel namespace, and studio's ownership-checked token mint.",
  ),
  "hosted-compute-flow": fig(
    "hosted-compute-flow",
    "Hosted Compute Flow",
    "distribution/hosted-compute",
    "Expands the Nodes box of the system context: the sentinel assigns a chunk, the node receives it on chunks:{key}, fetches its work context, runs simulate_intent in its worker pool, signs the result, and POSTs it to /chunks/complete.",
  ),
  "node-state": fig(
    "node-state",
    "Node State Machine",
    "distribution/hosted-compute",
    "Expands the node box of the hosted compute flow: the NodeCore lifecycle through Setup, Verifying, Registering, Running, NotFound, and Unavailable.",
  ),
  "chunk-claim-lifecycle": fig(
    "chunk-claim-lifecycle",
    "Chunk Claim Lifecycle",
    "distribution/hosted-compute",
    "Expands the claim box of the hosted compute flow: a chunk is claimed from the in-memory runtime, completed with one of four CompletionOutcomes (Accepted, Idempotent, Conflict, Stale), or swept by the reclaim cron back into the queue or to Failed.",
  ),
  "fly-topology": fig(
    "fly-topology",
    "Deployment Topology",
    "distribution/deployment",
    "Expands the Infra box of the system context: the six Fly apps in region lhr, Supabase, the Cloudflare edge, Latitude.sh burst nodes joined over the headscale mesh, and alloy shipping metrics to Grafana Cloud.",
  ),

  // 05 - Portal
  "portal-island-tree": fig(
    "portal-island-tree",
    "Portal Island Provider Tree",
    "portal/architecture",
    "The nesting order of the studio provider islands: the locale layout mounts theme, redux, query, and auth-events islands; the authenticated shell adds the search, WASM, and node islands around the app shell.",
  ),
  "browser-sim-flow": fig(
    "browser-sim-flow",
    "Browser Simulation Flow",
    "portal/simulation-ui",
    "Expands the Browser box of the system context for the user-facing path: SimC paste to parseSimc to buildSimConfig, then either a submitted job or a local worker WASM run, then decodeJobResult to charts.",
  ),
};
/* eslint-enable perfectionist/sort-objects */

export function getFigureNumber(id: string): number {
  return Object.keys(figures).indexOf(id) + 1;
}

export function getSection(page: string): string {
  const prefix = page.split("/")[0];

  return SECTIONS[prefix] ?? prefix;
}

export function groupBySection(list: Figure[]): Record<string, Figure[]> {
  const result: Record<string, Figure[]> = {};

  for (const fig of list) {
    const section = getSection(fig.page);

    result[section] ??= [];
    result[section].push(fig);
  }

  return result;
}
