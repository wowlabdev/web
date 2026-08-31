import "server-only";
import { NextResponse } from "next/server";

export const Status = {
  BadGateway: 502,
  BadRequest: 400,
  InternalError: 500,
  NotFound: 404,
  ServiceUnavailable: 503,
  Unauthorized: 401,
} as const;

export type StatusCode = (typeof Status)[keyof typeof Status];

export function apiError(
  status: StatusCode,
  error: string,
  init?: Omit<ResponseInit, "status">,
) {
  return NextResponse.json({ error }, { ...init, status });
}
