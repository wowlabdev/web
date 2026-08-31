import type {
  JobMeta,
  PermutationSpace,
  Profile,
  SlotCandidatesConfig,
} from "wowlab-common";

import { useQuery } from "@tanstack/react-query";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useState } from "react";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { useCommon } from "@/components/shared/wasm";
import { toQueryListResult, toQueryResult } from "@/lib/data/result";
import { log } from "@/lib/observability";
import { buildProfileSimConfig } from "@/lib/sim/intent";
import { useSimulatorStore } from "@/lib/state";
import { buildSentinelConfig } from "@/lib/wasm/api";
import { CreateJobResultSchema, parse } from "@/lib/zod";
import { href, routes, useLocalizedRouter } from "@wowlab/shared/lib/routing";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcArgs, throwIfError } from "./shared";

export type JobRow = Row<"jobs">;
type CreateJobArgs = RpcArgs<"create_job">;

// docref:start sim-ui-bib-tournament-phases
const BIB_TOURNAMENT_PHASES = [
  { iterations: 100, keep_fraction_x100: 10 },
  { iterations: 500, keep_fraction_x100: 50 },
  { iterations: 1000, keep_fraction_x100: 100 },
] as const;
// docref:end sim-ui-bib-tournament-phases

const BIB_FINAL_ITERATIONS = 1000;

export const JOB_KEY = ["jobs"] as const;

export type CreateJobResult = NonNullable<
  ReturnType<typeof parseCreateJobResult>
>;

export async function clearAllJobs(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("jobs").delete().gte("id", 0);

  throwIfError(error);
}

export async function createJob(
  params: CreateJobArgs,
): Promise<CreateJobResult | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_job", params);

  throwIfError(error);

  if (data === null) {
    return null;
  }

  const result = parseCreateJobResult(data);

  if (!result) {
    throw new Error("create_job returned an invalid payload");
  }

  return result;
}

export function getJobMeta(job: { meta: unknown }): JobMeta {
  return job.meta as JobMeta;
}

export function useJob(jobId: string) {
  return toQueryResult(
    useQuery<JobRow>({
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        throwIfError(error);

        if (!data) {
          throw new Error(`Job not found: ${jobId}`);
        }

        return data;
      },
      queryKey: [...JOB_KEY, jobId],
      refetchInterval: (query) => {
        const meta = query.state.data?.meta as JobMeta | undefined;
        const status = meta?.status;

        return status === "pending" || status === "running" ? 3000 : false;
      },
    }),
  );
}

export function useRecentJobs(limit = 5) {
  return toQueryListResult(
    useQuery<JobRow[]>({
      queryFn: async () => {
        const supabase = createClient();
        // RLS already scopes jobs to the current user, so no user_id filter is needed. There is no
        // top-level created column; the timestamp lives in meta.created_at (ISO-8601, sorts lexically).
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("meta->>created_at", { ascending: false })
          .limit(limit);

        throwIfError(error);

        return data ?? [];
      },
      queryKey: [...JOB_KEY, "recent", limit],
    }),
  );
}

export function useSubmitBibJob() {
  const common = useCommon();
  const router = useLocalizedRouter();
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const specId = useSimulatorStore((s) => s.specId);

  const [isSubmitting, { setFalse: stopSubmitting, setTrue: startSubmitting }] =
    useBoolean(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = specId !== null && rotationId !== null;

  const submit = useMemoizedFn(
    async (profile: Profile, space: PermutationSpace) => {
      if (!specId || !rotationId) {
        return;
      }

      startSubmitting();
      setSubmitError(null);

      try {
        const candidates = common.tournamentPayload(
          space,
        ) as SlotCandidatesConfig[];

        if (candidates.length === 0) {
          throw new Error(
            "Select at least two items in one slot before running.",
          );
        }

        const simConfig = buildProfileSimConfig(common, {
          profile,
          rotationId,
          specId,
        });

        const sentinelConfig = buildSentinelConfig(common, {
          iterations: BIB_FINAL_ITERATIONS,
          max_chunks: 0,
          priority: 0,
          strategy: "tournament",
          target_error: 0.005,
          tournament: {
            phases: [...BIB_TOURNAMENT_PHASES],
            slot_candidates: candidates,
          },
        });

        const result = await createJob({
          p_sentinel_config: sentinelConfig,
          p_sim_config: simConfig,
        });

        if (!result) {
          return;
        }

        router.push(href(routes.simulate.results, { id: result.jobId }));
      } catch (error) {
        log.withError(error).error("Failed to submit BiB job:");
        setSubmitError(
          error instanceof Error ? error.message : "Failed to submit job.",
        );
      } finally {
        stopSubmitting();
      }
    },
  );

  return { canSubmit, isSubmitting, submit, submitError };
}

export function useSubmitJob() {
  const common = useCommon();
  const router = useLocalizedRouter();
  const iterations = useSimulatorStore((s) => s.iterations);
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const specId = useSimulatorStore((s) => s.specId);

  const [isSubmitting, { setFalse: stopSubmitting, setTrue: startSubmitting }] =
    useBoolean(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = specId !== null && rotationId !== null;

  const submit = useMemoizedFn(async (profile: Profile) => {
    if (!specId || !rotationId) {
      return;
    }

    startSubmitting();
    setSubmitError(null);

    try {
      const simConfig = buildProfileSimConfig(common, {
        profile,
        rotationId,
        specId,
      });

      const sentinelConfig = buildSentinelConfig(common, {
        iterations,
        max_chunks: 0,
        priority: 0,
        target_error: 0.05,
      });

      const result = await createJob({
        p_sentinel_config: sentinelConfig,
        p_sim_config: simConfig,
      });

      if (!result) {
        return;
      }

      router.push(href(routes.simulate.results, { id: result.jobId }));
    } catch (error) {
      log.withError(error).error("Failed to submit job:");
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit job.",
      );
    } finally {
      stopSubmitting();
    }
  });

  return { canSubmit, isSubmitting, submit, submitError };
}

function parseCreateJobResult(data: unknown) {
  return parse(CreateJobResultSchema, data);
}
