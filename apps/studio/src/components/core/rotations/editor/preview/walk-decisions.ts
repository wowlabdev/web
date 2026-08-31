import type { Decision } from "wowlab-engine";

export function walkDecisions(
  decisions: readonly Decision[],
  visitor: (decision: Decision) => void,
): void {
  for (const decision of decisions) {
    visitor(decision);

    if (decision.nested.length > 0) {
      walkDecisions(decision.nested, visitor);
    }
  }
}
