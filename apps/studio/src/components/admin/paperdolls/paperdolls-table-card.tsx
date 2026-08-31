"use client";

import { Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { PaperdollRow } from "@/lib/query/services";

import { GameSpec } from "@/components/shared/game";
import { FormattedDate } from "@wowlab/shared/components/common";
import { SkeletonTable } from "@wowlab/shared/components/common/skeleton-blocks";
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

type PaperdollsTableCardProps = {
  data: PaperdollRow[] | undefined;
  isDeletePending: boolean;
  isFetching: boolean;
  onDelete: (specId: number) => Promise<void>;
};

export function PaperdollsTableCard({
  data,
  isDeletePending,
  isFetching,
  onDelete,
}: Readonly<PaperdollsTableCardProps>) {
  const content = useIntlayer("admin");

  const renderBody = () => {
    if (isFetching && !data) {
      return <SkeletonTable cols={["w-32", "w-28", "w-24", "w-8"]} />;
    }

    if (data && data.length > 0) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{content.paperdolls.spec}</TableHead>
              <TableHead>{content.paperdolls.character}</TableHead>
              <TableHead>{content.paperdolls.updated}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.spec_id}>
                <TableCell>
                  <GameSpec specId={row.spec_id} />
                </TableCell>
                <TableCell className="font-medium">
                  {row.character_name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <FormattedDate value={row.updated_at} dateStyle="medium" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void onDelete(row.spec_id)}
                    disabled={isDeletePending}
                  >
                    <Trash2Icon className="size-4" />
                    <span className="sr-only">{content.paperdolls.delete}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
      <p className="text-sm text-muted-foreground">
        {content.paperdolls.empty}
      </p>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.paperdolls.savedTitle}</CardTitle>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}
