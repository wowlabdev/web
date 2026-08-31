"use client";

import { useBoolean } from "ahooks";
import { useIntlayer } from "next-intlayer";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";

type ResultsSimConfigCardProps = {
  simConfig: string;
};

export function ResultsSimConfigCard({
  simConfig,
}: Readonly<ResultsSimConfigCardProps>) {
  const content = useIntlayer("resultsPage");
  const [isOpen, { toggle }] = useBoolean(false);

  return (
    <Collapsible open={isOpen} onOpenChange={toggle}>
      <Card className="mt-6">
        <CardHeader>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <CardTitle>{content.simConfig}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {isOpen ? content.hide : content.show}
            </span>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
              {simConfig}
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
