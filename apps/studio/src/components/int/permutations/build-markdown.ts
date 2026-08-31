import type { CostAnalysis, PermutationSpace, Profile } from "wowlab-common";

import { SLOT_LABELS } from "@/lib/sim/slots";

import type { FormatNumber } from "./shared";

import { compactNumber } from "./shared";
import { contestedSlots, itemsQuery, slotItemIds } from "./types";

type MarkdownBuilders = {
  Doc: new () => MarkdownDoc;
  Table: new () => MarkdownTable;
};

type MarkdownDoc = InstanceType<typeof import("wowlab-common").MarkdownDoc>;
type MarkdownTable = InstanceType<typeof import("wowlab-common").MarkdownTable>;

export function buildMarkdown(
  { Doc, Table }: MarkdownBuilders,
  profile: Profile,
  space: PermutationSpace,
  costs: CostAnalysis,
  fmtNumber: FormatNumber,
): string {
  const doc = new Doc();

  const f = (n: number) => compactNumber(fmtNumber, n);

  doc.h1("Permutation Space");
  writeCharacter(doc, profile.character);
  writeCostAnalysis(doc, new Table(), costs, space, fmtNumber, f);
  writeGearSummary(doc, profile, space);
  writeMcpTools(doc, profile, space);
  writePermutationCount(doc, space, fmtNumber);
  writeSlotTable(doc, new Table(), space);
  writeTalents(doc, profile);

  return doc.build();
}

function writeCharacter(doc: MarkdownDoc, ch: Profile["character"]) {
  doc.h2("Character");
  doc.kvBullet("Name", ch.name);
  doc.kvBullet("Class", ch.class);
  doc.kvBullet("Level", String(ch.level));

  if (ch.spec) {
    doc.kvBullet("Spec", ch.spec);
  }

  if (ch.region && ch.server) {
    doc.kvBullet("Realm", `${ch.region}/${ch.server}`);
  }

  if (ch.professions.length > 0) {
    doc.kvBullet(
      "Professions",
      ch.professions.map((p) => `${p.name} (${p.rank})`).join(", "),
    );
  }
}

function writeCostAnalysis(
  doc: MarkdownDoc,
  table: MarkdownTable,
  costs: CostAnalysis,
  space: PermutationSpace,
  fmtNumber: FormatNumber,
  f: (n: number) => string,
) {
  doc.blank();
  doc.h2("Hybrid Cost Analysis");
  doc.blank();
  doc.h3("Factorial Estimation");
  doc.kvBullet("Main effects", f(costs.mainEffectIters));
  doc.kvBullet(
    "Pairwise (top-4)",
    `${costs.pairCount} pairs = ${f(costs.pairIters)}`,
  );
  doc.kvBullet("Total estimation", f(costs.factorialTotal));
  doc.blank();
  doc.h3("Screening + Tournament");
  doc.blank();

  table.headers(["keep%", "Survivors", "Tournament", "Total", "Savings"]);

  for (const row of costs.screening) {
    table.row([
      `${row.keepPct}%`,
      fmtNumber(row.survivors),
      f(row.tournamentCost),
      f(row.totalCost),
      `${row.savingsPct.toFixed(1)}%`,
    ]);
  }

  doc.raw(table.buildMarkdown());
  doc.blank();
  doc.kvBullet(
    "Brute force",
    `${fmtNumber(space.total)} perms x 10K iters = ${f(costs.bruteForce)}`,
  );
}

function writeGearSummary(
  doc: MarkdownDoc,
  profile: Profile,
  space: PermutationSpace,
) {
  doc.blank();
  doc.h2("Gear Summary");
  doc.kvBullet("Equipped", String(profile.equipment.length));
  doc.kvBullet("Bag items", String(profile.bagItems.length));
  doc.kvBullet("Weekly rewards", String(profile.weeklyRewards.length));
  doc.kvBullet("Total candidates", String(space.totalCandidates));
  doc.kvBullet("Contested slots", String(space.contestedCount));
  doc.kvBullet(
    "Uncontested slots",
    String(space.slots.length - space.contestedCount),
  );
}

function writeMcpTools(
  doc: MarkdownDoc,
  profile: Profile,
  space: PermutationSpace,
) {
  const contested = contestedSlots(space);
  const uniqueIds = [...new Set(space.slots.flatMap((s) => slotItemIds(s)))];

  doc.blank();
  doc.h2("WoW Lab MCP Tools");
  doc.blank();
  doc.line("Use these tools to inspect the data in this profile:");

  doc.blank();
  doc.h3("Decode talents");
  doc.codeBlock(
    "",
    `decode_loadout({ loadout: "${profile.talents.encoded}" })`,
  );

  doc.blank();
  doc.h3("Look up all candidate items");
  doc.codeBlock("", itemsQuery(uniqueIds));

  doc.blank();
  doc.h3("Resolve item effects (procs, on-use, equip bonuses)");
  doc.line("Look up items first, then for any item with effects:");
  doc.codeBlock("", `resolve_effects({ ids: [SPELL_ID_FROM_ITEM_EFFECTS] })`);

  doc.blank();
  doc.h3("Query items by slot");
  doc.line("Example for head slot candidates:");
  const headSlot = contested.find((s) => s.slot === "head");

  if (headSlot) {
    doc.codeBlock("", itemsQuery(slotItemIds(headSlot)));
  } else {
    doc.codeBlock(
      "",
      `query({ table: "game.items", filters: [{ column: "id", op: "eq", value: ITEM_ID }] })`,
    );
  }

  doc.blank();
  doc.h3("Batch lookup all items at once");
  const batchLines = contested
    .map((sc) => `  ${itemsQuery(slotItemIds(sc))},`)
    .join("\n");

  doc.codeBlock("", `query_batch({ queries: [\n${batchLines}\n] })`);
}

function writePermutationCount(
  doc: MarkdownDoc,
  space: PermutationSpace,
  fmtNumber: FormatNumber,
) {
  const contested = contestedSlots(space);

  doc.blank();
  doc.h2("Permutation Count");
  doc.blank();
  const factors = contested
    .map((s) => `${SLOT_LABELS[s.slot]}:${s.candidates.length}`)
    .join(" x ");

  doc.line(`${factors} = **${fmtNumber(space.total)}**`);
}

function writeSlotTable(
  doc: MarkdownDoc,
  table: MarkdownTable,
  space: PermutationSpace,
) {
  doc.blank();
  doc.h2("Per-Slot Candidates");
  doc.blank();

  table.headers(["Slot", "Count", "Equipped", "Bag", "Weekly", "Item IDs"]);

  for (const sc of space.slots) {
    const eq = sc.candidates.filter((c) => c.source === "equipped").length;
    const bag = sc.candidates.filter((c) => c.source === "bag").length;
    const weekly = sc.candidates.filter((c) => c.source === "weekly").length;
    const contested = sc.candidates.length > 1 ? " *" : "";

    table.row([
      `${SLOT_LABELS[sc.slot]}${contested}`,
      String(sc.candidates.length),
      String(eq),
      String(bag),
      String(weekly),
      slotItemIds(sc).join(", "),
    ]);
  }

  doc.raw(table.buildMarkdown());
}

function writeTalents(doc: MarkdownDoc, profile: Profile) {
  if (!profile.talents.encoded) {
    return;
  }

  doc.blank();
  doc.h2("Talents");
  doc.blank();
  doc.line(`Active: \`${profile.talents.encoded}\``);

  if (profile.talents.loadouts.length > 0) {
    doc.blank();
    doc.line("Saved loadouts:");

    for (const loadout of profile.talents.loadouts) {
      doc.kvBullet(loadout.name, `\`${loadout.encoded}\``);
    }
  }
}
