import type { SpecTraitsRow } from "@/lib/game-data";

import {
  boundsFromPoints,
  type CanvasScene,
  type EdgeObject,
  type LabelObject,
  type NodeObject,
  type SceneObject,
} from "@/components/shared/canvas";
import {
  type TalentEdge,
  type TalentNode,
  type TalentSubTree,
  TalentTreeDataSchema,
} from "@/lib/zod";

import {
  CONTENT_LAYER_ID,
  LABEL_LAYER_ID,
  LAYERS,
  NODE_SIZE,
} from "../constants";
import { type TalentSceneOptions } from "./types";

export function buildTalentTreeScene(
  spec: SpecTraitsRow,
  options: TalentSceneOptions = {},
): CanvasScene {
  const parsed = TalentTreeDataSchema.safeParse({
    edges: spec.edges,
    nodes: spec.nodes,
    sub_trees: spec.sub_trees,
  });

  if (!parsed.success) {
    return {
      bounds: { height: 1, width: 1, x: 0, y: 0 },
      id: `talent-tree-${spec.spec_id}`,
      layers: LAYERS,
      metadata: {
        classNm: spec.class_name,
        specId: spec.spec_id,
        specName: spec.spec_name,
        treeId: spec.tree_id,
      },
      objects: [],
    };
  }

  const { edges, nodes, sub_trees: subTrees } = parsed.data;

  const selected = options.selection?.selectedNodeIds ?? new Set<number>();
  const ranks = options.selection?.ranksByNodeId;

  const objects: SceneObject[] = [
    ...nodes.map((node) => buildNodeObject(node, selected, ranks, options)),
    ...edges.map((edge) => buildEdgeObject(edge)),
  ];

  for (const sub of subTrees) {
    const label = buildSubTreeLabel(sub, nodes);

    if (label) {
      objects.push(label);
    }
  }

  const nodeBounds = boundsFromPoints(
    nodes.map((n) => ({ x: n.posX, y: n.posY })),
  );
  const bounds =
    nodes.length === 0
      ? { height: 1, width: 1, x: 0, y: 0 }
      : {
          height: nodeBounds.height + NODE_SIZE * 4,
          width: nodeBounds.width + NODE_SIZE * 4,
          x: nodeBounds.x - NODE_SIZE * 2,
          y: nodeBounds.y - NODE_SIZE * 2,
        };

  return {
    bounds,
    id: `talent-tree-${spec.spec_id}`,
    layers: LAYERS,
    metadata: {
      classNm: spec.class_name,
      specId: spec.spec_id,
      specName: spec.spec_name,
      treeId: spec.tree_id,
    },
    objects,
  };
}

function buildEdgeObject(edge: TalentEdge): EdgeObject {
  return {
    fromId: nodeId(edge.fromNodeId),
    id: edgeId(edge.fromNodeId, edge.toNodeId),
    kind: "edge",
    layerId: CONTENT_LAYER_ID,
    style: {
      opacity: 0.6,
      stroke: "#475569",
      strokeWidth: 1,
    },
    toId: nodeId(edge.toNodeId),
  };
}

function buildNodeObject(
  node: TalentNode,
  selected: ReadonlySet<number>,
  ranks: ReadonlyMap<number, number> | undefined,
  options: TalentSceneOptions,
): NodeObject {
  const entry = node.entries.length > 0 ? node.entries[0] : null;
  const isSelected = selected.has(node.id);
  const rank = ranks?.get(node.id);

  return {
    id: nodeId(node.id),
    isSelectable: true,
    kind: "node",
    label: options.shouldShowLabels && entry ? entry.name : undefined,
    layerId: CONTENT_LAYER_ID,
    metadata: {
      entries: node.entries,
      maxRanks: node.maxRanks,
      rawId: node.id,
      subTreeId: node.subTreeId,
    },
    position: { x: node.posX, y: node.posY },
    style: {
      badge: rank ? `${rank}/${node.maxRanks ?? "?"}` : undefined,
      fill: isSelected ? "#facc15" : "#1f2937",
      shape: node.subTreeId ? "diamond" : "circle",
      size: NODE_SIZE,
      stroke: isSelected ? "#fde68a" : "#475569",
    },
  };
}

function buildSubTreeLabel(
  sub: TalentSubTree,
  nodes: TalentNode[],
): LabelObject | null {
  let sectionMinX = Infinity;
  let sectionMinY = Infinity;

  for (const node of nodes) {
    if (node.subTreeId !== sub.id) {
      continue;
    }

    sectionMinX = Math.min(sectionMinX, node.posX);
    sectionMinY = Math.min(sectionMinY, node.posY);
  }

  if (sectionMinX === Infinity) {
    return null;
  }

  return {
    id: `talent-subtree-label-${sub.id}`,
    kind: "label",
    layerId: LABEL_LAYER_ID,
    position: { x: sectionMinX, y: sectionMinY - 32 },
    style: { fill: "#fbbf24", fontSize: 14 },
    text: sub.name,
  };
}

function edgeId(from: number, to: number): string {
  return `talent-edge-${from}-${to}`;
}

function nodeId(rawId: number): string {
  return `talent-node-${rawId}`;
}
