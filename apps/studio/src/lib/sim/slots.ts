import type { GearSlot } from "wowlab-common";

export const PAPERDOLL_LEFT_SLOTS: readonly GearSlot[] = [
  "head",
  "neck",
  "shoulders",
  "back",
  "chest",
  "wrists",
];

export const PAPERDOLL_RIGHT_SLOTS: readonly GearSlot[] = [
  "hands",
  "waist",
  "legs",
  "feet",
  "finger1",
  "finger2",
];

export const PAPERDOLL_TRINKET_SLOTS: readonly GearSlot[] = [
  "trinket1",
  "trinket2",
];

export const PAPERDOLL_WEAPON_SLOTS: readonly GearSlot[] = [
  "main_hand",
  "off_hand",
];

export const SLOT_ORDER: readonly GearSlot[] = [
  "head",
  "neck",
  "shoulders",
  "back",
  "chest",
  "wrists",
  "hands",
  "waist",
  "legs",
  "feet",
  "finger1",
  "finger2",
  "trinket1",
  "trinket2",
  "main_hand",
  "off_hand",
];

export const SLOT_LABELS: Record<GearSlot, string> = {
  back: "Back",
  chest: "Chest",
  feet: "Feet",
  finger1: "Finger 1",
  finger2: "Finger 2",
  hands: "Hands",
  head: "Head",
  legs: "Legs",
  main_hand: "Main Hand",
  neck: "Neck",
  off_hand: "Off Hand",
  shirt: "Shirt",
  shoulders: "Shoulders",
  tabard: "Tabard",
  trinket1: "Trinket 1",
  trinket2: "Trinket 2",
  waist: "Waist",
  wrists: "Wrists",
};
