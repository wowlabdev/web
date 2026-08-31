"use client";

import { SearchIcon, SwordsIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { StatGrid } from "@/components/shared/layout";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import { useRotationBrowseColumns } from "./use-rotation-browse-columns";
const ALL_CLASSES = "__all__";

export type RotationBrowseSpec = {
  class_name: string;
  file_name: string;
  id: number;
  name: string;
};
type RotationsBrowseContentProps = {
  rotations: Row<"rotations">[];
  specs: RotationBrowseSpec[];
};

export function RotationsBrowseContent({
  rotations,
  specs,
}: Readonly<RotationsBrowseContentProps>) {
  const content = useIntlayer("rotations");
  const [classFilter, setClassFilter] = useState(ALL_CLASSES);
  const specMap = useMemo(() => {
    const map = new Map<number, RotationBrowseSpec>();

    for (const spec of specs) {
      map.set(spec.id, spec);
    }

    return map;
  }, [specs]);
  const columns = useRotationBrowseColumns(specMap);
  const classNames = useMemo(() => {
    const names = new Set<string>();

    for (const spec of specs) {
      if (spec.class_name) {
        names.add(spec.class_name);
      }
    }

    return [...names].sort((a, b) => a.localeCompare(b));
  }, [specs]);
  const filtered = useMemo(() => {
    if (classFilter === ALL_CLASSES) {
      return rotations;
    }

    return rotations.filter((r) => {
      const spec = specMap.get(r.spec_id);

      return spec?.class_name === classFilter;
    });
  }, [rotations, classFilter, specMap]);

  if (rotations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <SwordsIcon className="size-8 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{content.zeroTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {content.zeroDescription}
          </p>
        </CardContent>
      </Card>
    );
  }

  const uniqueSpecs = new Set(rotations.map((r) => r.spec_id)).size;
  const stats = [
    {
      change: content.statTotalPublic.value,
      icon: <SwordsIcon className="size-4" />,
      key: "total",
      title: content.statTotalRotationsTitle.value,
      value: String(rotations.length),
    },
    {
      change: content.statClassesCount(classNames.length).value,
      icon: <SearchIcon className="size-4" />,
      key: "specs",
      title: content.statSpecsCoveredTitle.value,
      value: String(uniqueSpecs),
    },
    {
      change:
        classFilter === ALL_CLASSES
          ? content.showingAllClasses.value
          : classFilter,
      icon: <SwordsIcon className="size-4" />,
      key: "showing",
      title: content.statShowingTitle.value,
      value: String(filtered.length),
    },
  ];

  return (
    <div className="space-y-6">
      <StatGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            changePercentage={stat.change}
          />
        ))}
      </StatGrid>

      <div className="flex items-center justify-end">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={content.filterByClassPlaceholder.value} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CLASSES}>
              {content.filterAllClasses}
            </SelectItem>
            {classNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TableCard
        title={content.tableTitle.value}
        data={filtered}
        rowKey={(row) => row.id}
        columns={columns}
      />
    </div>
  );
}
