"use client";

import { PackageIcon, TagIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { SourceInstanceRow } from "@/components/core/simulate/drops/use-drops-sources";

import { useSourceCategoryLabels } from "@/components/core/simulate/use-source-category-labels";
import { useDifficultyLabels } from "@/components/shared/game";
import {
  DIFFICULTIES,
  type Difficulty,
  SOURCE_CATEGORIES,
  type SourceCategory,
  type SourceId,
} from "@/lib/sim/sources";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Button } from "@wowlab/shared/components/ui/button";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";
import { cn } from "@wowlab/shared/lib/utils";

type DropsSourcesStepProps = {
  categoryCount: number;
  difficulty: Difficulty;
  getInstanceRows: (category: SourceCategory) => SourceInstanceRow[];
  keyLevel: number;
  onBack: () => void;
  onDifficultyChange: (d: Difficulty) => void;
  onKeyLevelChange: (n: number) => void;
  onNext: () => void;
  onToggleCategory: (category: SourceCategory) => void;
  onToggleSource: (category: string, sourceId: SourceId) => void;
  selectedCategories: Set<SourceCategory>;
  sourceCount: number;
};

export function DropsSourcesStep({
  categoryCount,
  difficulty,
  getInstanceRows,
  keyLevel,
  onBack,
  onDifficultyChange,
  onKeyLevelChange,
  onNext,
  onToggleCategory,
  onToggleSource,
  selectedCategories,
  sourceCount,
}: Readonly<DropsSourcesStepProps>) {
  const content = useIntlayer("simulateDrops");
  const shared = useIntlayer("simulateShared");
  const categoryLabels = useSourceCategoryLabels();
  const difficultyLabels = useDifficultyLabels();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<TagIcon className="size-4" />}
          value={String(categoryCount)}
          title={content.statCategoriesTitle.value}
          changePercentage={
            content.statCategoriesAvailable({
              count: SOURCE_CATEGORIES.length,
            }).value
          }
        />
        <StatCard
          icon={<PackageIcon className="size-4" />}
          value={String(sourceCount)}
          title={content.statSourcesTitle.value}
          changePercentage={content.statSourcesSubtitle.value}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">
          {content.lootCategoriesTitle}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SOURCE_CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors",
                selectedCategories.has(cat.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Checkbox
                checked={selectedCategories.has(cat.id)}
                onCheckedChange={() => onToggleCategory(cat.id)}
              />
              {categoryLabels[cat.id]}
            </label>
          ))}
        </div>
      </div>

      {[...selectedCategories].map((category) => {
        const rows = getInstanceRows(category);

        if (rows.length === 0) {
          return null;
        }

        return (
          <TableCard
            key={category}
            title={categoryLabels[category]}
            columns={[
              {
                cell: (row: SourceInstanceRow) => (
                  <Checkbox
                    checked={row.isSelected}
                    onCheckedChange={() => onToggleSource(category, row.id)}
                  />
                ),
                className: "w-10",
                header: "",
              },
              {
                cell: (row: SourceInstanceRow) => row.label,
                header: content.headerInstance.value,
              },
            ]}
            data={rows}
            rowKey={(row: SourceInstanceRow) => row.id}
          />
        );
      })}

      {selectedCategories.has("raids") && (
        <div className="space-y-2">
          <Label>{content.raidDifficultyLabel}</Label>
          <ToggleGroup
            type="single"
            value={difficulty}
            onValueChange={(v) => {
              if (v) {
                onDifficultyChange(v as Difficulty);
              }
            }}
            variant="outline"
          >
            {DIFFICULTIES.map((d) => (
              <ToggleGroupItem key={d.id} value={d.id}>
                {difficultyLabels[d.id]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {selectedCategories.has("dungeons") && (
        <div className="space-y-2">
          <Label htmlFor="key-level">{content.keyLevelLabel}</Label>
          <div className="flex items-center gap-3">
            <Input
              id="key-level"
              type="number"
              min={2}
              max={20}
              value={keyLevel}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value, 10);

                if (!Number.isNaN(val)) {
                  onKeyLevelChange(val);
                }
              }}
              className="w-24"
            />
            <span className="text-xs text-muted-foreground">
              {content.keyLevelHint({ level: keyLevel })}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {shared.back}
        </Button>
        <Button onClick={onNext}>{shared.next}</Button>
      </div>
    </>
  );
}
