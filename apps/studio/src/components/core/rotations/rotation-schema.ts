import type { Action, Condition, Rotation } from "wowlab-engine";

import { z } from "zod";

const ConditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      domain: z.string(),
      key: z.string().optional(),
      name: z.string(),
      on: z.enum(["player", "target", "pet"]).optional(),
      type: z.literal("read"),
    }),
    z.object({ type: z.literal("bool"), value: z.boolean() }),
    z.object({ type: z.literal("int"), value: z.number().int() }),
    z.object({ type: z.literal("float"), value: z.number() }),
    z.object({ name: z.string(), type: z.literal("var") }),
    z.object({
      left: ConditionSchema,
      op: z.enum(["gt", "gte", "lt", "lte", "eq", "ne"]),
      right: ConditionSchema,
      type: z.literal("compare"),
    }),
    z.object({ operands: z.array(ConditionSchema), type: z.literal("and") }),
    z.object({ operands: z.array(ConditionSchema), type: z.literal("or") }),
    z.object({ operand: ConditionSchema, type: z.literal("not") }),
    z.object({
      left: ConditionSchema,
      op: z.enum(["add", "sub", "mul", "div", "mod"]),
      right: ConditionSchema,
      type: z.literal("arith"),
    }),
    z.object({
      op: z.enum(["floor", "ceil", "abs"]),
      operand: ConditionSchema,
      type: z.literal("unary_math"),
    }),
    z.object({
      left: ConditionSchema,
      op: z.enum(["min", "max"]),
      right: ConditionSchema,
      type: z.literal("min_max"),
    }),
    z.object({
      condition: ConditionSchema,
      otherwise: ConditionSchema,
      then: ConditionSchema,
      type: z.literal("if_then_else"),
    }),
  ]),
);

const ActionConditionSchema = {
  condition: ConditionSchema.optional(),
  enabled: z.boolean().optional(),
};

const ActionSchema: z.ZodType<Action> = z.discriminatedUnion("type", [
  z.object({
    ...ActionConditionSchema,
    empower_rank: z.number().int().optional(),
    spell: z.string(),
    target_if: z
      .object({
        expr: ConditionSchema,
        mode: z.enum(["min", "max", "first"]),
      })
      .optional(),
    type: z.literal("cast"),
  }),
  z.object({
    ...ActionConditionSchema,
    list: z.string(),
    type: z.literal("call"),
  }),
  z.object({
    ...ActionConditionSchema,
    list: z.string(),
    type: z.literal("run"),
  }),
  z.object({
    ...ActionConditionSchema,
    name: z.string(),
    type: z.literal("set_var"),
    value: ConditionSchema,
  }),
  z.object({
    ...ActionConditionSchema,
    name: z.string(),
    op: z.enum([
      "add",
      "sub",
      "mul",
      "div",
      "mod",
      "max",
      "min",
      "floor",
      "ceil",
      "reset",
    ]),
    type: z.literal("modify_var"),
    value: ConditionSchema,
  }),
  z.object({
    ...ActionConditionSchema,
    seconds: z.number(),
    type: z.literal("wait"),
  }),
  z.object({
    condition: ConditionSchema,
    enabled: z.boolean().optional(),
    type: z.literal("wait_until"),
  }),
  z.object({
    ...ActionConditionSchema,
    extra: z.number().optional(),
    type: z.literal("pool"),
  }),
  z.object({
    ...ActionConditionSchema,
    empower_rank: z.number().int().optional(),
    slot: z.number().int(),
    type: z.literal("use_trinket"),
  }),
  z.object({
    ...ActionConditionSchema,
    empower_rank: z.number().int().optional(),
    name: z.string(),
    type: z.literal("use_item"),
  }),
]);

const RotationSchema: z.ZodType<Rotation> = z.object({
  actions: z.array(ActionSchema),
  lists: z.record(z.string(), z.array(ActionSchema)),
  name: z.string(),
  variables: z.record(z.string(), ConditionSchema),
  version: z.number().int(),
});

export function parseStoredRotation(value: unknown): Rotation {
  return RotationSchema.parse(value);
}

export function tryParseActionList(value: unknown): Action[] | null {
  const result = z.array(ActionSchema).safeParse(value);

  return result.success ? result.data : null;
}

export function tryParseCondition(value: unknown): Condition | null {
  const result = ConditionSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function tryParseRotation(value: unknown): Rotation | null {
  const result = RotationSchema.safeParse(value);

  return result.success ? result.data : null;
}
