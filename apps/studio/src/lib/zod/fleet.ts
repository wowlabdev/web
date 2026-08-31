import { z } from "zod";

const LegacyBooleanSchema = z.preprocess(
  (value) => value === true,
  z.boolean(),
);

export const CreatePreAuthKeySchema = z.object({
  aclTags: z.preprocess(
    (value) =>
      Array.isArray(value) && value.every((entry) => typeof entry === "string")
        ? value
        : [],
    z.array(z.string()),
  ),
  ephemeral: LegacyBooleanSchema,
  expiration: z.string().min(1),
  reusable: LegacyBooleanSchema,
  userId: z.string().min(1),
});

export const ExpirePreAuthKeySchema = z.object({
  key: z.string().min(1),
  userId: z.string().min(1),
});

export const RenameNodeSchema = z.object({
  newName: z.string().trim().min(1),
});

export const SetNodeTagsSchema = z.object({
  tags: z.array(z.string()),
});
