export type Term = {
  id: string;
  name: string;
  long?: string;
  description: string;
  link?: string;
};

type TermName = string | [short: string, long: string];

function term(
  id: string,
  name: TermName,
  description: string,
  link?: string,
): Term {
  if (Array.isArray(name)) {
    return { description, id, link, long: name[1], name: name[0] };
  }

  return { description, id, link, name };
}

export const terms: Record<string, Term> = {
  beacon: term(
    "beacon",
    "beacon",
    "The realtime pub/sub server (Centrifugo v6, Fly.io region lhr). Every message pushed to a browser or node — chunk assignments, job progress, node presence — flows through it. Backed by NATS as the broker and Redis as the presence manager.",
    "/dev/bible/distribution/realtime",
  ),
  chunk: term(
    "chunk",
    "chunk",
    "The atomic unit of distribution. A ChunkAssignment declares a count of Monte-Carlo iterations (with optional min/max and an early-exit target_error), a seed offset, and an optional permutation index. One chunk runs sequentially on one node, reusing a single handler, queue, and sink, and produces one ChunkReport of protobuf telemetry.",
    "/dev/bible/distribution/orchestration",
  ),
  claim: term(
    "claim",
    "claim",
    "The sentinel's in-memory record that a specific node holds a specific chunk, carrying the work-context hash, work items, claim time, and reclaim count. Created at assignment, resolved at completion, and swept back into the queue by the reclaim cron if it goes stale.",
    "/dev/bible/distribution/hosted-compute",
  ),
  dbc: term(
    "dbc",
    ["DBC", "Database Client files"],
    "World of Warcraft's client-side game database, shipped as a large set of tables (historically .dbc files). WoW Lab consumes them as extracted CSV, one file per table, and treats them as the source of truth for every spell, item, and talent number.",
    "/dev/bible/game-data/dbc-overview",
  ),
  des: term(
    "des",
    ["DES", "discrete-event simulation"],
    "A simulation that advances a virtual clock by jumping to the timestamp of the next scheduled event rather than ticking at a fixed rate. The engine pops time-ordered events from a queue, advances the clock to each, and dispatches to a per-spec handler; nothing happens between events because nothing can.",
    "/dev/bible/engine/discrete-event-simulation",
  ),
  island: term(
    "island",
    "Island",
    'A focused "use client" provider in the studio App Router that mounts an interactive subsystem (a state store, the query cache, the WASM engine, the compute node) only where it is needed, keeping that cost off purely server-rendered pages.',
    "/dev/bible/portal/architecture",
  ),
  jit: term(
    "jit",
    ["JIT", "just-in-time compilation"],
    "Compiling an explicitly selected prepared rotation to native machine code at bootstrap via LLVM (the inkwell crate), so each evaluation collapses to straight-line code reading a flat buffer. WASM uses portable bytecode, and explicit decision traces use a private structural reference path.",
    "/dev/bible/engine/rotation-compiler",
  ),
  nats: term(
    "nats",
    "NATS",
    "The message broker backing beacon's pub/sub fan-out (Fly app wowlab-nats), co-located with beacon in lhr on the realtime hot path.",
    "/dev/bible/distribution/realtime",
  ),
  node: term(
    "node",
    "node",
    "Any compute participant that runs the simulation engine and signs its results with an Ed25519 keypair — a hosted Fly fleet machine, a contributor's desktop, a Latitude.sh burst server, or a browser tab. It subscribes to its own chunks:{publicKey} channel, fetches its work context, runs simulate_intent per iteration, and POSTs signed protobuf results back.",
    "/dev/bible/distribution/hosted-compute",
  ),
  pandemic: term(
    "pandemic",
    "pandemic",
    "On refreshing an active DoT, carrying over up to 30% of the base duration on top of the new duration instead of clipping the remainder (PANDEMIC_CARRY_PERCENT = 30).",
    "/dev/bible/engine/auras",
  ),
  redis: term(
    "redis",
    "Redis",
    "The external store backing beacon's presence manager (the nodes:online roster). Distinct from NATS, which is the broker — both back Centrifugo, for different subsystems.",
    "/dev/bible/distribution/realtime",
  ),
  "resolved-game-data": term(
    "resolved-game-data",
    "ResolvedGameData",
    "The Arc-wrapped, cheap-to-clone, read-only view of every number a spec needs for one simulation. Built once at bootstrap by resolve_game_data, which introspects the spec and folds resolver answers into a builder, then read back by the generated builder functions.",
    "/dev/bible/game-data/data-resolution",
  ),
  resolver: term(
    "resolver",
    ["resolver", "DataResolver"],
    "An implementation of the DataResolver port trait that answers per-id game-data queries (get_spell, get_item, get_scaling_data, ...). Five exist (Supabase, LocalCsv, Js, Overlay, InMemory); the engine depends only on the trait, so the source of the bytes is invisible to it.",
    "/dev/bible/game-data/data-resolution",
  ),
  rppm: term(
    "rppm",
    ["RPPM", "Real Procs Per Minute"],
    "A proc model where the per-trigger chance scales with elapsed time (and optionally haste) so a proc fires a target number of times per minute on average, regardless of attack speed. The engine's roll_rppm also applies Bad Luck Protection.",
    "/dev/bible/engine/procs",
  ),
  sentinel: term(
    "sentinel",
    "sentinel",
    "The scheduler. One Fly.io process (region lhr) that LISTENs for new jobs on the Postgres pending_job channel, splits each job into chunks, assigns them to eligible compute nodes, ingests signed completions over POST /chunks/complete, and finalizes results. Also hosts the HTTP API, Discord bot, cron jobs, and MCP server.",
    "/dev/bible/distribution/hosted-compute",
  ),
  snapshot: term(
    "snapshot",
    "snapshot",
    "A DoT that locks in the player's stats (attack/spell power, crit, versatility, mastery, damage multiplier) at application time and uses those for every tick, ignoring later stat changes; refresh keeps the higher damage multiplier (rolling DoT).",
    "/dev/bible/engine/auras",
  ),
  "spec-handler": term(
    "spec-handler",
    "SpecHandler",
    "The per-spec trait the simulation engine drives: it answers on_player_ready with a Cast or Wait, handles cast/aura/cooldown/auto-attack events, and reports total damage. One handler is built per chunk and reset between iterations.",
    "/dev/bible/engine/spec-handlers",
  ),
  stats: term(
    "stats",
    "stat recompute",
    "The step that turns primary attributes and ratings into combat-ready CombatStats; secondary ratings pass through rating_to_percent, which divides by the level rating constant and interpolates the DBC diminishing-returns curve.",
    "/dev/bible/engine/stats",
  ),
  telemetry: term(
    "telemetry",
    "telemetry",
    "The per-iteration combat data accumulated across a chunk (DPS samples, spell totals, aura uptimes, resource flows) by a TelemetryAccumulator and encoded into a protobuf ChunkTelemetry that becomes the chunk's report.",
    "/dev/bible/engine/metrics",
  ),
  "timing-wheel": term(
    "timing-wheel",
    "timing wheel",
    "The event queue structure: 32768 slots of 32 ms each plus an overflow bucket for far-future events, giving O(1) amortised push and pop. Chosen over a binary heap to keep scheduling off the hot path; ordering is ascending time with a FIFO sequence tiebreak.",
    "/dev/bible/engine/event-system",
  ),
  "work-context": term(
    "work-context",
    "work context",
    "The heavy, shared part of a job — base sim config, tournament payload, and sentinel config — fetched once per chunk by a node through a signed GET /jobs/{id}/work_context and cached, so later chunks of the same job reuse it.",
    "/dev/bible/distribution/hosted-compute",
  ),
};
