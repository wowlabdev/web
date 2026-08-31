import type { MarkdownDoc } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

const MAX_DECISIONS_IN_SUMMARY = 20;
const MAX_RESOURCE_SAMPLES_IN_SUMMARY = 10;
const MAX_AURA_EVENTS_IN_SUMMARY = 20;

export function appendTraceSummary(
  doc: MarkdownDoc,
  trace: IterationTrace,
): void {
  doc.blank();
  doc.h2("Summary");
  doc.kvBullet("estimatedDps", String(trace.estimatedDps));
  doc.kvBullet("totalCasts", String(trace.totalCasts));
  doc.kvBullet("gcdUtilizationPct", String(trace.gcdUtilizationPct));
  doc.kvBullet("durationMs", String(trace.durationMs));
  doc.kvBullet("decisions", String(trace.decisions.length));
  doc.kvBullet("resourceSamples", String(trace.resourceSamples.length));
  doc.kvBullet("auraEvents", String(trace.auraEvents.length));

  appendDecisions(doc, trace);
  appendResourceSamples(doc, trace);
  appendAuraEvents(doc, trace);
}

function appendAuraEvents(doc: MarkdownDoc, trace: IterationTrace): void {
  if (trace.auraEvents.length === 0) {
    return;
  }

  const slice = trace.auraEvents.slice(0, MAX_AURA_EVENTS_IN_SUMMARY);

  doc.blank();
  doc.h3(`First ${slice.length} aura events`);

  for (const e of slice) {
    const end = e.endMs == null ? "active@end" : `${e.endMs}ms`;

    doc.bullet(`${e.auraSlug} (${e.source}) ${e.startMs}ms..${end}`);
  }
}

function appendDecisions(doc: MarkdownDoc, trace: IterationTrace): void {
  if (trace.decisions.length === 0) {
    return;
  }

  const slice = trace.decisions.slice(0, MAX_DECISIONS_IN_SUMMARY);

  doc.blank();
  doc.h3(`First ${slice.length} decisions`);

  for (const d of slice) {
    const fired =
      d.firedActionIndex === undefined ? "none" : `#${d.firedActionIndex}`;
    const evals = d.evaluations
      .map((e) => `${e.actionIndex}=${e.status}`)
      .join(",");

    doc.bullet(`t=${d.timeMs}ms list=${d.listId} fired=${fired} [${evals}]`);
  }
}

function appendResourceSamples(doc: MarkdownDoc, trace: IterationTrace): void {
  if (trace.resourceSamples.length === 0) {
    return;
  }

  const slice = trace.resourceSamples.slice(0, MAX_RESOURCE_SAMPLES_IN_SUMMARY);

  doc.blank();
  doc.h3(`First ${slice.length} resource samples`);

  for (const s of slice) {
    doc.bullet(`t=${s.timeMs}ms ${s.resourceName} ${s.current}/${s.max}`);
  }
}
