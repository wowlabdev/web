import type { Database } from "./database.types";

export type Class = GameRow<"classes">;
export type Enum<T extends keyof Enums> = Enums[T];
export type GameRow<T extends keyof GameTables> = GameTables[T]["Row"];
export type GlobalColor = GameRow<"global_colors">;

export type GlobalString = GameRow<"global_strings">;
export type Insert<T extends keyof Tables> = Tables[T]["Insert"];
export type Item = GameRow<"items">;
export type ItemSearchResult = {
  file_name: string;
  id: number;
  item_level: number;
  name: string;
  quality: number;
};
export type ItemSummary = Pick<
  GameRow<"items">,
  | "class_id"
  | "expansion_id"
  | "file_name"
  | "id"
  | "inventory_type"
  | "item_level"
  | "item_set_id"
  | "name"
  | "quality"
  | "required_level"
  | "subclass_id"
>;
export type Row<T extends keyof Tables> = Tables[T]["Row"];

export type Spec = GameRow<"specs">;
export type SpecTraits = GameRow<"specs_traits">;
export type Spell = GameRow<"spells">;
export type SpellSearchResult = {
  file_name: string;
  id: number;
  name: string;
};
export type SpellSummary = {
  labels: number[];
} & Pick<
  GameRow<"spells">,
  | "cast_time"
  | "description"
  | "file_name"
  | "id"
  | "is_passive"
  | "name"
  | "recovery_time"
  | "school_mask"
>;
export type Update<T extends keyof Tables> = Tables[T]["Update"];
export type UserIdentity = {
  avatarUrl: string | null;
  email: string | null;
  handle: string | null;
  id: string;
};

export type View<T extends keyof Views> = Views[T]["Row"];

type Enums = Database["public"]["Enums"];

type GameTables = Database["game"]["Tables"];

type Tables = Database["public"]["Tables"];

type Views = Database["public"]["Views"];
