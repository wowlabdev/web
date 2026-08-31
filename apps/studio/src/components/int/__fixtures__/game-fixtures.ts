export type GameFixture = {
  id: number;
  label: string;
};

export const ITEM_FIXTURES: readonly GameFixture[] = [
  { id: 206_448, label: "Fyr'alath the Dreamrender" },
  { id: 204_177, label: "Nasz'uro, the Unbound Legacy" },
  { id: 242_402, label: "Araz's Ritual Forge" },
  { id: 237_735, label: "Voidglass Sovereign's Blade" },
  { id: 242_405, label: "Band of the Shattered Soul" },
  { id: 236_792, label: "Footpads of the Insatiable Vision" },
  { id: 213_580, label: "Heart-Lesion Helm" },
];

export const SPELL_FIXTURES: readonly GameFixture[] = [
  { id: 133, label: "Fireball" },
  { id: 116, label: "Frostbolt" },
  { id: 30_451, label: "Arcane Blast" },
  { id: 11_366, label: "Pyroblast" },
  { id: 1953, label: "Blink" },
  { id: 2139, label: "Counterspell" },
  { id: 118, label: "Polymorph" },
];

export const AURA_FIXTURES: readonly GameFixture[] = [
  { id: 12_472, label: "Icy Veins" },
  { id: 190_319, label: "Combustion" },
  { id: 2825, label: "Bloodlust" },
  { id: 1459, label: "Arcane Intellect" },
  { id: 21_562, label: "Power Word: Fortitude" },
  { id: 6673, label: "Battle Shout" },
];

export const SPEC_FIXTURES: readonly GameFixture[] = [
  { id: 62, label: "Arcane Mage" },
  { id: 63, label: "Fire Mage" },
  { id: 66, label: "Protection Paladin" },
  { id: 65, label: "Holy Paladin" },
  { id: 70, label: "Retribution Paladin" },
  { id: 71, label: "Arms Warrior" },
];

export const MISSING_ID = 999_999_999;

export const DEFAULT_CLASS_ID = 8;
export const DEFAULT_ITEM_ID = ITEM_FIXTURES[0].id;
export const DEFAULT_SPELL_ID = SPELL_FIXTURES[0].id;
export const DEFAULT_SPEC_ID = SPEC_FIXTURES[0].id;

export const SAMPLE_ITEM_IDS: number[] = ITEM_FIXTURES.map((f) => f.id);
export const SAMPLE_SPELL_IDS: number[] = SPELL_FIXTURES.map((f) => f.id);

export const SAMPLE_BONUS_IDS: number[] = [13_730, 13_760];
