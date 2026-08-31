export type { Action, Condition, Rotation } from "wowlab-engine";

export type SpecSpellMap = {
  auras: Map<string, number>;
  spells: Map<string, number>;
  specId: number;
};
