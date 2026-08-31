"use client";

import { useIntlayer } from "next-intlayer";

import { buildDungeonScene } from "../scene/build-scene";

type SelectionPanelProps = {
  obj: ReturnType<typeof buildDungeonScene>["objects"][number] | null;
};

export function SelectionPanel({ obj }: Readonly<SelectionPanelProps>) {
  const content = useIntlayer("plan");

  if (!obj) {
    return (
      <div className="border border-border p-3 text-xs">
        <p className="text-muted-foreground">{content.dungeonSelectionEmpty}</p>
      </div>
    );
  }

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <h3 className="text-xs font-medium">{content.dungeonSelectionTitle}</h3>
      </div>
      <dl className="grid grid-cols-[6rem_1fr] gap-x-2 gap-y-1 px-3 py-2 text-[11px]">
        <dt className="text-muted-foreground">{content.dungeonSelectionId}</dt>
        <dd className="font-mono">{obj.id}</dd>
        <dt className="text-muted-foreground">
          {content.dungeonSelectionKind}
        </dt>
        <dd>{obj.kind}</dd>
        <dt className="text-muted-foreground">
          {content.dungeonSelectionLayer}
        </dt>
        <dd>{obj.layerId}</dd>
        {obj.metadata
          ? Object.entries(obj.metadata).map(([key, value]) => (
              <span key={key} className="contents">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="break-all font-mono">
                  {formatMetadataValue(value)}
                </dd>
              </span>
            ))
          : null}
      </dl>
    </div>
  );
}

function formatMetadataValue(value: unknown): string {
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
