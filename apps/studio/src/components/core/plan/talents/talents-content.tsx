"use client";

import { useIntlayer } from "next-intlayer";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { WasmBoundary } from "@/components/shared/wasm";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

import { TalentsTreeView } from "./talents-tree-view";

const PLACEHOLDER_LOADOUT =
  "C0PA11Mk8aZ38kAf+zso3nZ9IYMbDMgBMbsFyYBAAAAAAzM2mxYmBmZYmlZmZmBzYmMjZMDzMMzYGGDzMMLDz2yMYDAAAAAAmB";

export function TalentsContent() {
  const content = useIntlayer("plan");
  const [submittedLoadout, setSubmittedLoadout] = useQueryState(
    "loadout",
    parseAsString.withDefault(""),
  );
  const [loadoutInput, setLoadoutInput] = useState(submittedLoadout);

  // Sync textarea to URL on external change (back/forward, deep link); typing without submitting deliberately leaves the URL untouched.
  const [trackedLoadout, setTrackedLoadout] = useState(submittedLoadout);

  if (trackedLoadout !== submittedLoadout) {
    setTrackedLoadout(submittedLoadout);
    setLoadoutInput(submittedLoadout);
  }

  return (
    <div className="space-y-4">
      <div id="tour-plan-talents" className="space-y-2">
        <h2 className="text-base font-semibold">
          {content.talentsImportTitle}
        </h2>
        <p className="text-muted-foreground text-xs">
          {content.talentsImportDescription}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="loadout">{content.talentsLoadoutLabel}</Label>
        <Textarea
          id="loadout"
          placeholder={PLACEHOLDER_LOADOUT}
          value={loadoutInput}
          onChange={(event) => setLoadoutInput(event.target.value)}
          className="min-h-24 font-mono"
        />
      </div>

      <Button
        type="button"
        onClick={() => setSubmittedLoadout(loadoutInput.trim() || null)}
        disabled={!loadoutInput.trim()}
      >
        {content.talentsImport}
      </Button>

      <WasmBoundary fallback={<Skeleton className="h-[600px] w-full" />}>
        <TalentsTreeView submittedLoadout={submittedLoadout} />
      </WasmBoundary>
    </div>
  );
}
