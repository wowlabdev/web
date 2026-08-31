import { z } from "zod";

export const TalentEntrySchema = z.object({
  iconFileName: z.string().optional(),
  name: z.string().optional(),
  spellId: z.number().optional(),
});

export type TalentEntry = z.infer<typeof TalentEntrySchema>;

export const TalentNodeSchema = z.object({
  entries: z.array(TalentEntrySchema).default([]),
  id: z.number(),
  maxRanks: z.number().optional(),
  posX: z.number(),
  posY: z.number(),
  subTreeId: z.number().optional(),
});

export type TalentNode = z.infer<typeof TalentNodeSchema>;

export const TalentEdgeSchema = z.object({
  fromNodeId: z.number(),
  toNodeId: z.number(),
});

export type TalentEdge = z.infer<typeof TalentEdgeSchema>;

export const TalentSubTreeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type TalentSubTree = z.infer<typeof TalentSubTreeSchema>;

export const TalentTreeDataSchema = z.object({
  edges: z.array(TalentEdgeSchema),
  nodes: z.array(TalentNodeSchema),
  sub_trees: z.array(TalentSubTreeSchema),
});

export type TalentTreeData = z.infer<typeof TalentTreeDataSchema>;
