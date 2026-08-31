type ApiOperatorDefinition = {
  group: "arith" | "compare" | "logical" | "min_max" | "unary_math";
  id: string;
  symbol: string;
};

export const API_OPERATORS = [
  { group: "compare", id: "gt", symbol: ">" },
  { group: "compare", id: "gte", symbol: ">=" },
  { group: "compare", id: "lt", symbol: "<" },
  { group: "compare", id: "lte", symbol: "<=" },
  { group: "compare", id: "eq", symbol: "==" },
  { group: "compare", id: "ne", symbol: "!=" },
  { group: "arith", id: "add", symbol: "+" },
  { group: "arith", id: "sub", symbol: "-" },
  { group: "arith", id: "mul", symbol: "*" },
  { group: "arith", id: "div", symbol: "/" },
  { group: "arith", id: "mod", symbol: "%" },
  { group: "unary_math", id: "floor", symbol: "floor()" },
  { group: "unary_math", id: "ceil", symbol: "ceil()" },
  { group: "unary_math", id: "abs", symbol: "abs()" },
  { group: "min_max", id: "min", symbol: "min()" },
  { group: "min_max", id: "max", symbol: "max()" },
  { group: "logical", id: "and", symbol: "AND" },
  { group: "logical", id: "or", symbol: "OR" },
  { group: "logical", id: "not", symbol: "NOT" },
] as const satisfies readonly ApiOperatorDefinition[];

export const API_ACTIONS = [
  { id: "cast" },
  { id: "call" },
  { id: "run" },
  { id: "set_var" },
  { id: "modify_var" },
  { id: "wait" },
  { id: "wait_until" },
  { id: "pool" },
  { id: "use_item" },
  { id: "use_trinket" },
] as const satisfies readonly { id: string }[];

export type ApiActionEntry = (typeof API_ACTIONS)[number];
export type ApiOperatorEntry = (typeof API_OPERATORS)[number];
