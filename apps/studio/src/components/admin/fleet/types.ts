import type { FleetNode } from "@/lib/query/services";

export type NodeActionHandlers = {
  onRename: (node: FleetNode) => void;
  onSetTags: (node: FleetNode) => void;
  onExpire: (node: FleetNode) => void;
  onDelete: (node: FleetNode) => void;
};
