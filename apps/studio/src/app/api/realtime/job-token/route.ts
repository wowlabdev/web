import { connection, NextResponse } from "next/server";

import {
  mintConnectionToken,
  mintSubscriptionToken,
} from "@/lib/realtime/job-progress-token";
import { requireUser } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";
import { createClient } from "@wowlab/shared/lib/supabase/server";

export async function GET(request: Request) {
  await connection();

  const auth = await requireUser();

  if (!auth.ok) {
    return auth.response;
  }

  const userId = auth.claims.sub;

  if (typeof userId !== "string") {
    return apiError(Status.Unauthorized, "unauthorized");
  }

  const jobId = new URL(request.url).searchParams.get("jobId");

  if (!jobId) {
    return apiError(Status.BadRequest, "missing jobId");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, user_id")
    .eq("id", jobId)
    .single();

  if (error) {
    return apiError(Status.NotFound, "job not found");
  }

  if (data.user_id !== userId) {
    return apiError(Status.NotFound, "job not found");
  }

  const channel = `jobs:${jobId}`;
  // docref:start realtime-job-token-route
  const [connectionToken, subscriptionToken] = await Promise.all([
    mintConnectionToken(userId),
    mintSubscriptionToken(userId, channel),
  ]);
  // docref:end realtime-job-token-route

  return NextResponse.json({ channel, connectionToken, subscriptionToken });
}
