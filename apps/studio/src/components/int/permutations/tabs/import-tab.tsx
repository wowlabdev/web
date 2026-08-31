"use client";

import { useIntlayer } from "next-intlayer";

import { MOCK_SIMC_INPUT } from "@/components/core/simulate/mock-bags/mock-simc-input";
import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";

export type ImportTabProps = {
  onSimcInputChange: (s: string) => void;
  parseError: string | null;
  simcInput: string;
};

export function ImportTab({
  onSimcInputChange,
  parseError,
  simcInput,
}: Readonly<ImportTabProps>) {
  const content = useIntlayer("permutationsPage");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="simc-input">{content.importTab.label}</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSimcInputChange(MOCK_SIMC_INPUT)}
          >
            {content.importTab.loadExample}
          </Button>
          {simcInput ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSimcInputChange("")}
            >
              {content.importTab.clear}
            </Button>
          ) : null}
        </div>
      </div>
      <textarea
        id="simc-input"
        className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 h-64 w-full resize-y rounded-none border bg-transparent px-2.5 py-2 font-mono text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1"
        placeholder={content.importTab.placeholder.value}
        value={simcInput}
        onChange={(e) => onSimcInputChange(e.target.value)}
      />
      {parseError ? (
        <p className="text-xs text-destructive">{parseError}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {content.importTab.helper}
        </p>
      )}
    </div>
  );
}
