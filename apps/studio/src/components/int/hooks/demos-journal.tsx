"use client";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { useJournalList } from "@/lib/game-data";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

import { MAX_PREVIEW } from "./demo-helpers";
import { ResultPanel } from "./result-panel";
import { resultState } from "./result-state";
import { useEntityColumns } from "./use-entity-columns";

export function UseJournalListDemo() {
  const game = useIntlayer("sharedGame");
  const columns = useEntityColumns();
  const [kind, setKind] = useState<"dungeon" | "raid">("dungeon");
  const result = useJournalList(kind);
  const state = resultState(result);
  const rows = result.data ?? [];

  return (
    <div className="space-y-3">
      <ToggleGroup
        className="flex gap-2"
        onValueChange={(value) => {
          if (value === "dungeon" || value === "raid") {
            setKind(value);
          }
        }}
        type="single"
        value={kind}
        variant="outline"
      >
        <ToggleGroupItem value="dungeon">
          {game.sourceCategoryDungeons}
        </ToggleGroupItem>
        <ToggleGroupItem value="raid">
          {game.sourceCategoryRaids}
        </ToggleGroupItem>
      </ToggleGroup>
      {state === "ok" ? (
        <TableCard
          columns={columns.journal}
          data={rows.slice(0, MAX_PREVIEW)}
          rowKey={(row) => row.id}
          title={`useJournalList (${rows.length})`}
        />
      ) : (
        <ResultPanel state={state} />
      )}
    </div>
  );
}
