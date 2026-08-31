"use client";

import { useIntlayer } from "next-intlayer";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";
type PullListProps = {
  pulls: ReadonlyArray<{
    index: number;
    color: string;
    packIds: ReadonlyArray<number>;
    enemyCount: number;
  }>;
  focusedPullIndex: number | undefined;
  onFocus: (index: number | undefined) => void;
};

export function PullList({
  focusedPullIndex,
  onFocus,
  pulls,
}: Readonly<PullListProps>) {
  const content = useIntlayer("plan");

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <h3 className="text-xs font-medium">
          {content.dungeonPullsTitle({ count: pulls.length })}
        </h3>
      </div>
      {pulls.length === 0 ? (
        <p className="text-muted-foreground p-3 text-xs">
          {content.dungeonPullsEmpty}
        </p>
      ) : (
        <ScrollArea className="max-h-72">
          <ItemGroup className="divide-y divide-border">
            {pulls.map((pull) => {
              const isActive = focusedPullIndex === pull.index;

              return (
                <Item
                  key={pull.index}
                  asChild
                  size="sm"
                  variant={isActive ? "muted" : "default"}
                  className="gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onFocus(isActive ? undefined : pull.index)}
                    className="hover:bg-muted/40 w-full text-left"
                    aria-pressed={isActive}
                  >
                    <ItemMedia
                      className="flex size-6 items-center justify-center text-xs font-semibold text-slate-900"
                      style={{ backgroundColor: pull.color }}
                    >
                      {pull.index}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-medium">
                        {content.dungeonPullEnemies({
                          count: pull.enemyCount,
                          index: pull.index,
                        })}
                      </ItemTitle>
                      <ItemDescription>
                        {content.dungeonPullPacks(pull.packIds.length)}
                        {isActive ? content.dungeonPullFocused : ""}
                      </ItemDescription>
                    </ItemContent>
                  </button>
                </Item>
              );
            })}
          </ItemGroup>
        </ScrollArea>
      )}
    </div>
  );
}
