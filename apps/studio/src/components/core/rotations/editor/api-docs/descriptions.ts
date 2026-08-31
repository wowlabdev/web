import type { useIntlayer } from "next-intlayer";

import type { ApiActionEntry, ApiOperatorEntry } from "./operator-catalog";

export type FieldSort = "alpha" | "type";

type RotationEditorContent = ReturnType<typeof useIntlayer<"rotationEditor">>;
type RotationEditorContentKey = Extract<keyof RotationEditorContent, string>;

export const OPERATOR_DESCRIPTION_KEY = {
  abs: "apiOpAbs",
  add: "apiOpAdd",
  and: "apiOpAnd",
  ceil: "apiOpCeil",
  div: "apiOpDiv",
  eq: "apiOpEq",
  floor: "apiOpFloor",
  gt: "apiOpGt",
  gte: "apiOpGte",
  lt: "apiOpLt",
  lte: "apiOpLte",
  max: "apiOpMax",
  min: "apiOpMin",
  mod: "apiOpMod",
  mul: "apiOpMul",
  ne: "apiOpNe",
  not: "apiOpNot",
  or: "apiOpOr",
  sub: "apiOpSub",
} as const satisfies Record<ApiOperatorEntry["id"], RotationEditorContentKey>;

export const ACTION_DESCRIPTION_KEY = {
  call: "apiActionCall",
  cast: "apiActionCast",
  modify_var: "apiActionModifyVar",
  pool: "apiActionPool",
  run: "apiActionRun",
  set_var: "apiActionSetVar",
  use_item: "apiActionUseItem",
  use_trinket: "apiActionUseTrinket",
  wait: "apiActionWait",
  wait_until: "apiActionWaitUntil",
} as const satisfies Record<ApiActionEntry["id"], RotationEditorContentKey>;

export const OPERATOR_GROUP_KEY = {
  arith: "apiOperatorGroupArith",
  compare: "apiOperatorGroupCompare",
  logical: "apiOperatorGroupLogical",
  min_max: "apiOperatorGroupMinMax",
  unary_math: "apiOperatorGroupUnaryMath",
} as const satisfies Record<
  ApiOperatorEntry["group"],
  RotationEditorContentKey
>;
