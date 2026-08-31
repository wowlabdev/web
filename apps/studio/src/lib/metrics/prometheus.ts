import { z } from "zod";

import type { TimeRange } from "./types";

import { RANGE_SECONDS, RANGE_STEPS } from "./constants";

type PrometheusConfig = {
  token: string;
  url: string;
  user: string;
};

const PrometheusInstantResponseSchema = z.object({
  data: z.object({
    result: z.array(
      z.object({
        metric: z.record(z.string(), z.string()),
        value: z.tuple([z.number(), z.string()]),
      }),
    ),
  }),
  status: z.string(),
});

export type PrometheusInstantResponse = z.infer<
  typeof PrometheusInstantResponseSchema
>;

export function getPrometheusConfig(): PrometheusConfig | null {
  const url = process.env.GRAFANA_PROMETHEUS_URL;
  const user = process.env.GRAFANA_PROMETHEUS_USER;
  const token = process.env.GRAFANA_PROMETHEUS_TOKEN;

  if (!url || !user || !token) {
    return null;
  }

  return { token, url, user };
}

export function parsePrometheusInstantResponse(
  value: unknown,
): PrometheusInstantResponse | null {
  const result = PrometheusInstantResponseSchema.safeParse(value);

  return result.success ? result.data : null;
}

export async function queryPrometheus(
  config: PrometheusConfig,
  metrics: string[],
): Promise<Record<string, number>> {
  const basicAuth = btoa(`${config.user}:${config.token}`);

  const results = await Promise.all(
    metrics.map(async (metric) => {
      const params = new URLSearchParams({ query: metric });
      const response = await fetch(`${config.url}/api/v1/query?${params}`, {
        headers: { Authorization: `Basic ${basicAuth}` },
        next: { revalidate: 30 },
      });

      if (!response.ok) {
        return { error: true, metric, value: 0 };
      }

      const json = parsePrometheusInstantResponse(await response.json());

      if (!json || json.status !== "success" || json.data.result.length === 0) {
        return { error: false, metric, value: 0 };
      }

      return {
        error: false,
        metric,
        value: Number(json.data.result[0].value[1]),
      };
    }),
  );

  const data: Record<string, number> = {};

  for (const r of results) {
    if (!r.error) {
      data[r.metric] = r.value;
    }
  }

  return data;
}

export async function queryPrometheusRange(
  config: PrometheusConfig,
  metric: string,
  range: TimeRange,
): Promise<Response> {
  const rangeSec = RANGE_SECONDS[range];
  const step = RANGE_STEPS[range];

  if (!rangeSec) {
    throw new Error(`Invalid range: ${range}`);
  }

  const basicAuth = btoa(`${config.user}:${config.token}`);
  const now = Math.floor(Date.now() / 1000);
  const start = now - rangeSec;

  const params = new URLSearchParams({
    end: String(now),
    query: metric,
    start: String(start),
    step: String(step),
  });

  return fetch(`${config.url}/api/v1/query_range?${params}`, {
    headers: { Authorization: `Basic ${basicAuth}` },
    next: { revalidate: step },
  });
}
