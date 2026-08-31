"use client";

import type { ReactElement } from "react";

import { useIntlayer } from "next-intlayer";

import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";

import type { Action, SpecSpellMap } from "./rotation-view-types";

import { useActionTypeLabels } from "./action-type-labels";
import { ConditionTreeView } from "./condition-tree-view";
import { RotationSpell } from "./rotation-spell";

type RotationActionListProps = {
  actions: Action[];
  listName: string;
  specMap: SpecSpellMap | null;
};

export function RotationActionList({
  actions,
  listName,
  specMap,
}: Readonly<RotationActionListProps>) {
  const content = useIntlayer("rotations");
  const typeLabels = useActionTypeLabels();

  if (actions.length === 0) {
    return null;
  }

  const renderActionContent = (action: Action): ReactElement => {
    if (action.type === "cast") {
      return <RotationSpell slug={action.spell} specMap={specMap} />;
    }

    if (action.type === "call" || action.type === "run") {
      return <>{content.actionCallPrefix({ list: action.list })}</>;
    }

    return <>{typeLabels[action.type]}</>;
  };

  const rows = actions.map((action, idx) => ({
    action,
    priority: idx + 1,
  }));

  return (
    <TableCard
      title={listName}
      data={rows}
      rowKey={(_, idx) => idx}
      columns={[
        {
          cell: (row) => (
            <span className="text-muted-foreground">#{row.priority}</span>
          ),
          className: "w-12",
          header: content.columnPriority.value,
        },
        {
          cell: (row) => (
            <Badge variant="outline" className="text-xs">
              {renderActionContent(row.action)}
            </Badge>
          ),
          header: content.columnAction.value,
        },
        {
          cell: (row) => (
            <span className="text-muted-foreground text-xs line-clamp-2 inline-flex flex-wrap items-center gap-x-1">
              {row.action.condition ? (
                <ConditionTreeView
                  condition={row.action.condition}
                  specMap={specMap}
                />
              ) : (
                content.actionAlways
              )}
            </span>
          ),
          header: content.columnCondition.value,
        },
      ]}
    />
  );
}
