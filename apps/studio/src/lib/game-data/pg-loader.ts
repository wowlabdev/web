import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@wowlab/shared/lib/supabase/database.types";

export type GameSliceQuery = ReturnType<
  ReturnType<ReturnType<GameSupabase["schema"]>["from"]>["select"]
>;

export type GameSupabase = ReturnType<typeof createSupabaseClient<Database>>;

type GameTable = keyof Database["game"]["Tables"] & string;

const ID_BATCH_SIZE = 1000;

const PAGE_SIZE = 1000;

export async function getByIds<T extends { id: number }>(
  supabase: GameSupabase,
  table: string,
  ids: number[],
  columns = "*",
): Promise<T[]> {
  const rows: T[] = [];

  for (let i = 0; i < ids.length; i += ID_BATCH_SIZE) {
    const batch = ids.slice(i, i + ID_BATCH_SIZE);
    const { data } = await supabase
      .schema("game")
      .from(table as GameTable)
      .select(columns)
      .in("id", batch)
      .throwOnError();

    rows.push(...parseRows<T>(data, table));
  }

  return rows;
}

export async function loadSlice<T extends { id: number }>(
  supabase: GameSupabase,
  table: string,
  applyFilter: (q: GameSliceQuery) => GameSliceQuery,
  columns = "*",
): Promise<T[]> {
  const rows: T[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const query = applyFilter(
      supabase
        .schema("game")
        .from(table as GameTable)
        .select(columns),
    ).range(offset, offset + PAGE_SIZE - 1);

    const { data } = await query.throwOnError();
    const page = parseRows<T>(data, table);

    rows.push(...page);

    if (page.length < PAGE_SIZE) {
      return rows;
    }
  }
}

function parseRows<T extends { id: number }>(
  value: unknown,
  table: string,
): T[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Invalid ${table} query response`);
  }

  return value.map((row, index) => {
    if (
      !row ||
      typeof row !== "object" ||
      !("id" in row) ||
      typeof row.id !== "number"
    ) {
      throw new TypeError(`Invalid ${table} row at index ${index}`);
    }

    return row as T;
  });
}
