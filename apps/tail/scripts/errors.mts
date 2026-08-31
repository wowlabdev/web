import { argv, chalk } from "zx";

import { cloudflareCredentials } from "#cloudflare";
import { DATASETS, type DatasetTarget, errorQuery } from "#schema";

interface AnalyticsError {
  message: string;
}

interface AnalyticsResponse {
  data: Record<string, unknown>[];
  errors: AnalyticsError[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseResponse(value: unknown): AnalyticsResponse {
  if (!isRecord(value)) {
    throw new Error("Cloudflare returned an invalid Analytics response");
  }

  const data = Array.isArray(value.data) ? value.data.filter(isRecord) : [];
  const errors = Array.isArray(value.errors)
    ? value.errors.flatMap((error) => {
        if (!isRecord(error) || typeof error.message !== "string") {
          return [];
        }

        return [{ message: error.message }];
      })
    : [];

  return { data, errors };
}

function positiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function printRows(rows: Record<string, unknown>[]): void {
  if (argv.json) {
    console.log(JSON.stringify(rows, undefined, 2));

    return;
  }

  console.table(rows);
}

function target(value: unknown): DatasetTarget {
  if (value === "dev" || value === "prod") {
    return value;
  }

  throw new Error("Target must be dev or prod");
}

if (argv.help) {
  console.log("Usage: pnpm errors [dev|prod] [--hours N] [--limit N] [--json]");
} else {
  const selectedTarget = target(argv._[0] ?? "dev");
  const { account, token } = await cloudflareCredentials();
  const hours = positiveInteger(argv.hours, 24);
  const limit = positiveInteger(argv.limit, 50);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`;
  const response = await fetch(endpoint, {
    body: errorQuery(selectedTarget, hours, limit),
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
  });
  const result = parseResponse(await response.json());

  if (!response.ok || result.errors.length > 0) {
    const reason = result.errors.map(({ message }) => message).join("; ");

    throw new Error(reason || `Analytics query failed with ${response.status}`);
  }

  console.log(
    chalk.dim(
      `${DATASETS[selectedTarget]} over ${hours}h, ${result.data.length} groups`,
    ),
  );
  printRows(result.data);
}
