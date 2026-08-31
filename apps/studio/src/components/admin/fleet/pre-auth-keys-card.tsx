"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { FleetData, FleetPreAuthKey } from "@/lib/query/services";

import { FormattedDate } from "@wowlab/shared/components/common";
import { SkeletonTable } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

type PreAuthKeysCardProps = {
  data?: FleetData;
  isLoading: boolean;
  onCreate: () => void;
  onExpireKey: (userId: string, key: string) => void;
};

type PreAuthKeysTableProps = {
  keys: FleetPreAuthKey[];
  onExpire: (userId: string, key: string) => void;
};

export function PreAuthKeysCard({
  data,
  isLoading,
  onCreate,
  onExpireKey,
}: Readonly<PreAuthKeysCardProps>) {
  const content = useIntlayer("admin");

  const renderBody = () => {
    if (isLoading) {
      return (
        <SkeletonTable
          cols={["w-24", "w-20", "w-12", "w-12", "w-16", "w-28", "w-8"]}
        />
      );
    }

    if (data && data.preAuthKeys.length > 0) {
      return (
        <PreAuthKeysTable keys={data.preAuthKeys} onExpire={onExpireKey} />
      );
    }

    return (
      <p className="text-muted-foreground text-sm">{content.fleet.noKeys}</p>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{content.fleet.preAuthKeys}</CardTitle>
        <Button size="sm" onClick={onCreate}>
          <PlusIcon className="size-4" />
          {content.fleet.createKey}
        </Button>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}

function PreAuthKeysTable({ keys, onExpire }: Readonly<PreAuthKeysTableProps>) {
  const content = useIntlayer("admin");

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{content.fleet.id}</TableHead>
            <TableHead>{content.fleet.user}</TableHead>
            <TableHead>{content.fleet.reusable}</TableHead>
            <TableHead>{content.fleet.ephemeral}</TableHead>
            <TableHead>{content.fleet.used}</TableHead>
            <TableHead>{content.fleet.expiration}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-mono text-xs">{key.id}</TableCell>
              <TableCell>{key.userName}</TableCell>
              <TableCell className="text-muted-foreground">
                {key.reusable ? content.fleet.yes : content.fleet.no}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {key.ephemeral ? content.fleet.yes : content.fleet.no}
              </TableCell>
              <TableCell>
                {key.used ? (
                  <Badge variant="secondary">{content.fleet.usedBadge}</Badge>
                ) : (
                  <span className="text-muted-foreground">
                    {content.fleet.no}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {key.expiration ? (
                  <FormattedDate
                    value={key.expiration}
                    dateStyle="medium"
                    timeStyle="short"
                  />
                ) : (
                  content.fleet.never
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onExpire(key.userId, key.key)}
                >
                  <XCircleIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
