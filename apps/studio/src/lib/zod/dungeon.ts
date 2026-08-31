import { z } from "zod";

export const VertexSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Vertex = z.infer<typeof VertexSchema>;

const VerticesJsonSchema = z
  .string()
  .transform((raw, ctx): unknown => {
    try {
      return JSON.parse(raw);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "vertices_json is not valid JSON",
      });

      return z.NEVER;
    }
  })
  .pipe(z.array(VertexSchema));

export const FloorEnemySchema = z.object({
  enemy_pack_id: z.number().nullable(),
  enemy_patrol_id: z.number().nullable(),
  id: z.number(),
  lat: z.number(),
  lng: z.number(),
  npc_id: z.number().nullable(),
});

export type FloorEnemy = z.infer<typeof FloorEnemySchema>;

export const FloorPackSchema = z
  .object({
    group: z.number().nullable(),
    id: z.number(),
    label: z.string().nullable(),
    vertices_json: VerticesJsonSchema,
  })
  .transform((pack) => ({
    group: pack.group,
    id: pack.id,
    label: pack.label,
    vertices: pack.vertices_json,
  }));

export type FloorPack = z.infer<typeof FloorPackSchema>;

export const FloorPatrolSchema = z.object({
  id: z.number(),
  polyline: z
    .object({ vertices_json: VerticesJsonSchema })
    .transform((p) => ({ vertices: p.vertices_json }))
    .nullable(),
});

export type FloorPatrol = z.infer<typeof FloorPatrolSchema>;

export const FloorPayloadSchema = z.object({
  enemies: z.array(FloorEnemySchema),
  packs: z.array(FloorPackSchema),
  patrols: z.array(FloorPatrolSchema),
});

export type FloorPayload = z.infer<typeof FloorPayloadSchema>;

const FloorTileMetaSchema = z.object({
  cols: z.number().int().nonnegative(),
  rows: z.number().int().nonnegative(),
  zoom: z.number().int().nonnegative(),
});

const DungeonManifestFloorSchema = z.object({
  hasData: z.boolean(),
  index: z.number().int().nonnegative(),
  isDefault: z.boolean(),
  name: z.string(),
  tileHeight: z.number().int().positive(),
  tileWidth: z.number().int().positive(),
  zoomLevels: z.array(FloorTileMetaSchema),
});

export const DungeonManifestEntrySchema = z.object({
  abbreviation: z.string().optional(),
  expansion: z.string(),
  floors: z.array(DungeonManifestFloorSchema),
  key: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type DungeonManifestEntry = z.infer<typeof DungeonManifestEntrySchema>;

export const DungeonManifestSchema = z.object({
  dungeons: z.array(DungeonManifestEntrySchema),
  generatedAt: z.string(),
  source: z.string(),
});

export type DungeonManifest = z.infer<typeof DungeonManifestSchema>;
