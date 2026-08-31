"use client";

import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";

type ResultsErrorCardProps = {
  message?: string;
};

export function ResultsErrorCard({ message }: Readonly<ResultsErrorCardProps>) {
  const content = useIntlayer("resultsPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.errorTitle}</CardTitle>
        <CardDescription>{message ?? content.jobNotFound}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href="/">{content.runAnother}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
