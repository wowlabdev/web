"use client";

import { useSet } from "ahooks";
import { ChevronsDownIcon, ChevronsUpIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { FleetData } from "@/lib/query/services";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { SkeletonTable } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import type { NodeActionHandlers } from "./types";

import { NodeRow } from "./node-row";

type ClientsCardProps = {
  data?: FleetData;
  isLoading: boolean;
} & NodeActionHandlers;

export function ClientsCard({
  data,
  isLoading,
  onDelete,
  onExpire,
  onRename,
  onSetTags,
}: ClientsCardProps) {
  const content = useIntlayer("admin");
  const [search, setSearch] = useState("");
  const [
    expanded,
    { add: addExpanded, remove: removeExpanded, reset: collapseAll },
  ] = useSet<string>();

  const filteredNodes = useFuzzySearch({
    items: data?.nodes ?? [],
    keys: ["givenName", "id", "name", "status", "userName"] as const,
    query: search,
  });

  const toggleExpanded = (id: string) => {
    if (expanded.has(id)) {
      removeExpanded(id);
    } else {
      addExpanded(id);
    }
  };

  const expandAll = () => {
    for (const node of filteredNodes) {
      addExpanded(node.id);
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <SkeletonTable cols={["w-32", "w-16", "w-12", "w-24", "w-8"]} />;
    }

    if (filteredNodes.length > 0) {
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.fleet.name}</TableHead>
                <TableHead>{content.fleet.online}</TableHead>
                <TableHead className="text-right">
                  {content.fleet.chunks}
                </TableHead>
                <TableHead>{content.fleet.lastSeen}</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNodes.map((node) => (
                <NodeRow
                  key={node.id}
                  node={node}
                  isOpen={expanded.has(node.id)}
                  onToggle={toggleExpanded}
                  onRename={onRename}
                  onSetTags={onSetTags}
                  onExpire={onExpire}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <p className="text-muted-foreground text-sm">{content.fleet.noClients}</p>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{content.fleet.clients}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={expandAll}
            disabled={
              filteredNodes.length === 0 ||
              expanded.size === filteredNodes.length
            }
            title={content.fleet.expandAll.value}
          >
            <ChevronsDownIcon className="size-4" />
            <span className="sr-only">{content.fleet.expandAll}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={collapseAll}
            disabled={expanded.size === 0}
            title={content.fleet.collapseAll.value}
          >
            <ChevronsUpIcon className="size-4" />
            <span className="sr-only">{content.fleet.collapseAll}</span>
          </Button>
          <Input
            className="max-w-xs"
            placeholder={content.fleet.search.value}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}
