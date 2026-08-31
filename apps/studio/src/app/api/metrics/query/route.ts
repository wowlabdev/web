import { connection, type NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_METRICS,
  getPrometheusConfig,
  isTimeRange,
  queryPrometheus,
  queryPrometheusRange,
} from "@/lib/metrics";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function GET(request: NextRequest) {
  await connection();

  const config = getPrometheusConfig();

  if (!config) {
    return apiError(Status.ServiceUnavailable, "Grafana Cloud not configured");
  }

  const params = request.nextUrl.searchParams;
  const metrics = parseMetrics(params.get("metrics"), params.get("metric"));

  if (metrics.length === 0) {
    return apiError(
      Status.BadRequest,
      "Invalid or missing metric(s) parameter",
    );
  }

  const requestedRange = params.get("range");

  if (!requestedRange) {
    const data = await queryPrometheus(config, metrics);

    return NextResponse.json({ data, status: "success" });
  }

  if (metrics.length > 1) {
    return apiError(
      Status.BadRequest,
      "Range queries only support single metric",
    );
  }

  if (!isTimeRange(requestedRange)) {
    return apiError(Status.BadRequest, "Invalid range parameter");
  }

  try {
    const response = await queryPrometheusRange(
      config,
      metrics[0],
      requestedRange,
    );

    if (!response.ok) {
      return apiError(Status.BadGateway, "Failed to query Prometheus");
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadRequest, message);
  }
}

function parseMetrics(list: string | null, single: string | null): string[] {
  if (list) {
    return list.split(",").filter((m) => ALLOWED_METRICS.has(m));
  }

  if (single && ALLOWED_METRICS.has(single)) {
    return [single];
  }

  return [];
}
