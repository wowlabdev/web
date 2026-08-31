import { z } from "zod";

import { tryParseJson } from "./utils";

export const StoredKeypairSchema = z.object({
  privateKey: z.string().min(1),
  publicKey: z.string().min(1),
});

export const SentinelRegisterResponseSchema = z.object({
  beaconToken: z.string().min(1),
});

export const ChunkPayloadSchema = z.object({
  chunkIndex: z.number().int().nonnegative(),
  iterations: z.number().int().positive(),
  jobId: z.string().min(1),
  seedOffset: z.number().int().nonnegative(),
  simConfig: z.string().min(1),
});

export const JobProgressTopPermutationSchema = z.object({
  iterations: z.number().int().nonnegative(),
  meanDpsX10: z.number().int().nonnegative(),
  permIdx: z.number().int().nonnegative(),
});

export const JobProgressPayloadSchema = z.object({
  chunksCompleted: z.number().int().nonnegative(),
  chunksTotal: z.number().int().nonnegative(),
  completedAt: z.string().nullish(),
  permutationsActive: z.number().int().nonnegative().optional(),
  phase: z.number().int().nonnegative().optional(),
  phaseCount: z.number().int().nonnegative().optional(),
  status: z.string().min(1),
  topK: z.array(JobProgressTopPermutationSchema).optional(),
  topMeanDpsX10: z.number().int().nonnegative().optional(),
});

export const JobProgressEventSchema = z.object({
  payload: JobProgressPayloadSchema,
  type: z.literal("updated"),
});

export const CreateJobResultSchema = z.object({
  jobId: z.string().min(1),
});

export const JobProgressTokenResponseSchema = z.object({
  channel: z.string().min(1),
  connectionToken: z.string().min(1),
  subscriptionToken: z.string().min(1),
});

export const CreateJobRpcResponseSchema = CreateJobResultSchema.nullable();

export const ChunkSubmitResponseSchema = z.object({
  alreadyCompleted: z.boolean().optional(),
  jobComplete: z.boolean(),
  success: z.boolean(),
});

export const SimPayloadSchema = z.object({
  job_id: z.string(),
  season_id: z.string(),
  spec_id: z.number(),
});

export const ActivityItemSchema = z.discriminatedUnion("type", [
  z.object({
    at: z.string(),
    id: z.string(),
    payload: SimPayloadSchema,
    type: z.literal("sim_completed"),
  }),
  z.object({
    at: z.string(),
    id: z.string(),
    payload: SimPayloadSchema,
    type: z.literal("sim_failed"),
  }),
]);

export type ActivityItem = z.infer<typeof ActivityItemSchema>;

export const ActivityItemsSchema = z.preprocess(
  tryParseJson,
  z.array(ActivityItemSchema),
);
