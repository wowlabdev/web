"use client";

import { useIntlayer } from "next-intlayer";

import { formatSlug } from "@/components/core/rotations/format-slug";
import { Badge } from "@wowlab/shared/components/ui/badge";

import type { ActionEntry } from "../types";

type ActionSummaryProps = {
  action: ActionEntry;
};

export function ActionSummary({ action }: Readonly<ActionSummaryProps>) {
  const content = useIntlayer("rotationEditor");

  const summary = (() => {
    switch (action.type) {
      case "call": {
        return content.actionSummaryCall({
          list: action.list ?? content.actionSummaryCallFallback.value,
        });
      }

      case "cast": {
        return action.spell
          ? formatSlug(action.spell)
          : content.actionSummaryCast.value;
      }

      case "modify_var": {
        return content.actionSummaryModify({
          name: action.name ?? content.actionSummaryModifyFallbackName.value,
          op: action.op ?? content.actionSummaryModifyFallbackOp.value,
        });
      }

      case "pool": {
        return content.actionSummaryPool;
      }

      case "run": {
        return content.actionSummaryRun({
          list: action.list ?? content.actionSummaryCallFallback.value,
        });
      }

      case "set_var": {
        return content.actionSummarySet({
          name: action.name ?? content.actionSummarySetFallback.value,
        });
      }

      case "use_item": {
        return action.name
          ? formatSlug(action.name)
          : content.actionSummaryUseItem.value;
      }

      case "use_trinket": {
        return content.actionSummaryTrinket({ slot: action.slot ?? 1 });
      }

      case "wait": {
        return content.actionSummaryWait({ seconds: action.seconds ?? 0 });
      }

      case "wait_until": {
        return content.actionSummaryWaitUntil;
      }
    }
  })();

  return (
    <Badge variant="outline" className="shrink-0 text-xs">
      {summary}
    </Badge>
  );
}
