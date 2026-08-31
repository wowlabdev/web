"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import {
  DEFAULT_ITEM_ID,
  SAMPLE_BONUS_IDS,
  SAMPLE_ITEM_IDS,
} from "@/components/int/__fixtures__/game-fixtures";
import { GameItem } from "@/components/shared/game";
import {
  useItem,
  useItems,
  useItemScaling,
  useItemSummaries,
  useItemSummary,
  useResolvedItem,
} from "@/lib/game-data";
import { useItemSearch } from "@/lib/query/services";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Input } from "@wowlab/shared/components/ui/input";

import { ByIdDemo } from "./by-id-demo";
import { IdsListDemo, parseIds, SearchTableDemo } from "./demo-helpers";
import { ResultFrame, ResultPanel } from "./result-panel";
import { resultState } from "./result-state";
import { useEntityColumns } from "./use-entity-columns";

const NO_BONUS: number[] = [];

export function UseItemDemo() {
  return (
    <ByIdDemo
      useResult={useItem}
      defaultId={DEFAULT_ITEM_ID}
      render={(id) => <GameItem id={id} size="md" />}
    />
  );
}

export function UseItemScalingDemo() {
  const content = useIntlayer("hooksPage");
  const [raw, setRaw] = useState(SAMPLE_BONUS_IDS.join(", "));
  const bonusIds = useMemo(() => parseIds(raw), [raw]);
  const result = useItemScaling(bonusIds);

  return (
    <div className="space-y-3">
      <Input
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
        placeholder={content.idsLabel.value}
      />
      <ResultFrame>
        <ResultPanel state={resultState(result)}>
          <Badge variant="outline">{content.resolved}</Badge>
        </ResultPanel>
      </ResultFrame>
    </div>
  );
}

export function UseItemsDemo() {
  const columns = useEntityColumns();

  return (
    <IdsListDemo
      useResult={useItems}
      columns={columns.item}
      defaultIds={SAMPLE_ITEM_IDS}
      title="useItems"
    />
  );
}

export function UseItemSearchDemo() {
  const columns = useEntityColumns();

  return (
    <SearchTableDemo
      useSearch={useItemSearch}
      columns={columns.item}
      defaultQuery="Thunder"
      title="useItemSearch"
    />
  );
}

export function UseItemSummariesDemo() {
  const columns = useEntityColumns();

  return (
    <IdsListDemo
      useResult={useItemSummaries}
      columns={columns.item}
      defaultIds={SAMPLE_ITEM_IDS}
      title="useItemSummaries"
    />
  );
}

export function UseItemSummaryDemo() {
  return (
    <ByIdDemo
      useResult={useItemSummary}
      defaultId={DEFAULT_ITEM_ID}
      render={(id) => <GameItem id={id} size="md" />}
    />
  );
}

export function UseResolvedItemDemo() {
  const [id, setId] = useState(DEFAULT_ITEM_ID);
  const { data: item } = useItem(id);
  const result = useResolvedItem(item, NO_BONUS);

  return (
    <div className="space-y-3">
      <Input
        type="number"
        className="w-32"
        value={id}
        onChange={(event) => setId(Number(event.target.value))}
      />
      <ResultFrame>
        <ResultPanel state={resultState(result)}>
          {result.data ? (
            <span>
              {result.data.name} ({result.data.item_level})
            </span>
          ) : null}
        </ResultPanel>
      </ResultFrame>
    </div>
  );
}
