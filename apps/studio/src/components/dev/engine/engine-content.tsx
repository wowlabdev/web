"use client";

import type { ImplementedSpecInfo } from "wowlab-common";

import { useMemoizedFn } from "ahooks";
import {
  BarChart3,
  Cpu,
  Flame,
  GitCommitHorizontal,
  Sparkles,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { useCommon, useEngine } from "@/components/shared/wasm";
import { parseImplementedSpecs } from "@/lib/wasm/api";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Link } from "@wowlab/shared/components/ui/link";
import { makeBenchReportUrl } from "@wowlab/shared/lib/links";

import { SpecDetails } from "./spec-details";
import { useSpecColumns } from "./use-spec-columns";
type ClassGroup = {
  class_id: number;
  class_name: string;
  specs: ImplementedSpecInfo[];
};

export function EngineContent() {
  const content = useIntlayer("enginePage");
  const common = useCommon();
  const engine = useEngine();
  const [expandedSpecId, setExpandedSpecId] = useState<number | null>(null);
  const specs = useMemo(
    () => parseImplementedSpecs(common, engine.getImplementedSpecs()),
    [common, engine],
  );
  const totals = useMemo(
    () => ({
      auras: specs.reduce((sum, s) => sum + s.aura_count, 0),
      spells: specs.reduce((sum, s) => sum + s.spell_count, 0),
      talents: specs.reduce((sum, s) => sum + s.talent_count, 0),
    }),
    [specs],
  );
  const classGroups = useMemo<ClassGroup[]>(() => {
    const groups = new Map<number, ClassGroup>();

    for (const spec of specs) {
      let group = groups.get(spec.class_id);

      if (!group) {
        group = {
          class_id: spec.class_id,
          class_name: spec.class_name,
          specs: [],
        };
        groups.set(spec.class_id, group);
      }

      group.specs.push(spec);
    }

    return [...groups.values()].sort((a, b) =>
      a.class_name.localeCompare(b.class_name),
    );
  }, [specs]);
  const specColumns = useSpecColumns(expandedSpecId);
  const handleRowClick = useMemoizedFn((row: ImplementedSpecInfo) => {
    setExpandedSpecId((prev) => (prev === row.spec_id ? null : row.spec_id));
  });
  const isRowExpanded = useMemoizedFn(
    (row: ImplementedSpecInfo) => expandedSpecId === row.spec_id,
  );
  const renderExpandedRow = useMemoizedFn((row: ImplementedSpecInfo) => (
    <SpecDetails engine={engine} specId={row.spec_id} />
  ));
  const stats = [
    {
      change: `${totals.talents} ${content.talents.value.toLowerCase()}`,
      icon: <Cpu className="size-4" />,
      key: "specs",
      title: content.implementedSpecs.value,
      value: String(specs.length),
    },
    {
      change: content.acrossSpecs({ count: specs.length }).value,
      icon: <Flame className="size-4" />,
      key: "spells",
      title: content.spells.value,
      value: String(totals.spells),
    },
    {
      change: content.acrossSpecs({ count: specs.length }).value,
      icon: <Sparkles className="size-4" />,
      key: "auras",
      title: content.auras.value,
      value: String(totals.auras),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
        <GitCommitHorizontal className="size-4" />
        <span>v{engine.getEngineVersion()}</span>
        <span className="text-muted-foreground/50">
          ({engine.getEngineGitHash()})
        </span>
        <span className="text-muted-foreground/30">&middot;</span>
        <Link
          href={makeBenchReportUrl()}
          target="_blank"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <BarChart3 className="size-3.5" />
          <span>{content.benchmarkReport}</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            changePercentage={stat.change}
          />
        ))}
      </div>

      <div className="space-y-4">
        {classGroups.map((group) => (
          <TableCard
            key={group.class_id}
            title={
              <span className="inline-flex items-center gap-2">
                {group.class_name}
                <Badge variant="outline" className="font-normal">
                  {content.specCount(group.specs.length)}
                </Badge>
              </span>
            }
            columns={specColumns}
            data={group.specs}
            rowKey={getSpecRowKey}
            onRowClick={handleRowClick}
            isRowExpanded={isRowExpanded}
            renderExpandedRow={renderExpandedRow}
          />
        ))}
      </div>
    </div>
  );
}

function getSpecRowKey(row: ImplementedSpecInfo) {
  return row.spec_id;
}
