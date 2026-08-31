import type { JournalSource } from "./types";

export function encounterKey(instanceId: number, encounterId: number): string {
  return `${instanceId}:${encounterId}`;
}

export function getAllEncounterKeys(sources: JournalSource[]): string[] {
  return sources.flatMap((source) =>
    source.encounters.map((encounter) =>
      encounterKey(source.instanceId, encounter.id),
    ),
  );
}

// eslint-disable-next-line sonarjs/function-return-type -- tri-state mirrors Radix CheckedState (boolean | "indeterminate"); the union is the intended contract
export function getTriState(
  selected: number,
  total: number,
): boolean | "indeterminate" {
  if (selected === total) {
    return true;
  }

  if (selected > 0) {
    return "indeterminate";
  }

  return false;
}
