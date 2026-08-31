"use client";

import { useIntlayer } from "next-intlayer";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Separator } from "@wowlab/shared/components/ui/separator";
type SimulatorChunksCardProps = {
  chunkCount: number;
};

export function SimulatorChunksCard({
  chunkCount,
}: Readonly<SimulatorChunksCardProps>) {
  const content = useIntlayer("simulatorPage");

  if (chunkCount === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-6" />
      <Card>
        <CardHeader>
          <CardTitle>{content.assignedChunks}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {content.chunksReceived(chunkCount)}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
