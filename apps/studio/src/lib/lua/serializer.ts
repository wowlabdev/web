export type LuaObject = {
  [key: string]: LuaValue;
};

export type LuaRaw = {
  __lua: string;
};

export type LuaValue =
  LuaObject | LuaRaw | boolean | number | string | LuaValue[];

const LUA_RESERVED = new Set([
  "and",
  "break",
  "do",
  "else",
  "elseif",
  "end",
  "false",
  "for",
  "function",
  "if",
  "in",
  "local",
  "nil",
  "not",
  "or",
  "repeat",
  "return",
  "then",
  "true",
  "until",
  "while",
]);

export function luaRaw(value: string): LuaRaw {
  return { __lua: value };
}

export function serializeLuaValue(value: LuaValue, depth = 0): string {
  if (isLuaRaw(value)) {
    return value.__lua;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Cannot serialize non-finite Lua number: ${value}`);
    }

    return String(value);
  }

  if (typeof value === "string") {
    return escapeLuaString(value);
  }

  if (Array.isArray(value)) {
    return serializeLuaArray(value, depth);
  }

  return serializeLuaObject(value, depth);
}

function escapeLuaString(value: string) {
  let escaped = "";

  for (const char of value) {
    if (char === '"') {
      escaped += String.raw`\"`;
      continue;
    }

    if (char === "\n") {
      escaped += String.raw`\n`;
      continue;
    }

    if (char === "\r") {
      escaped += String.raw`\r`;
      continue;
    }

    if (char === "\t") {
      escaped += String.raw`\t`;
      continue;
    }

    if (char === "\\") {
      escaped += "\\\\";
      continue;
    }

    const codePoint = char.codePointAt(0) ?? 0;

    if (codePoint < 32) {
      escaped += `\\${codePoint.toString().padStart(3, "0")}`;
      continue;
    }

    escaped += char;
  }

  return `"${escaped}"`;
}

function isLuaRaw(value: LuaValue): value is LuaRaw {
  return typeof value === "object" && !Array.isArray(value) && "__lua" in value;
}

function serializeLuaArray(value: LuaValue[], depth: number) {
  if (value.length === 0) {
    return "{}";
  }

  const indent = "    ".repeat(depth);
  const childIndent = "    ".repeat(depth + 1);

  return `{\n${value
    .map((item) => `${childIndent}${serializeLuaValue(item, depth + 1)},`)
    .join("\n")}\n${indent}}`;
}

function serializeLuaKey(key: string) {
  if (/^[A-Za-z_]\w*$/.test(key) && !LUA_RESERVED.has(key)) {
    return key;
  }

  return `[${escapeLuaString(key)}]`;
}

function serializeLuaObject(value: LuaObject, depth: number) {
  const entries = Object.entries(value);

  if (entries.length === 0) {
    return "{}";
  }

  const indent = "    ".repeat(depth);
  const childIndent = "    ".repeat(depth + 1);

  return `{\n${entries
    .map(
      ([key, item]) =>
        `${childIndent}${serializeLuaKey(key)} = ${serializeLuaValue(
          item,
          depth + 1,
        )},`,
    )
    .join("\n")}\n${indent}}`;
}
