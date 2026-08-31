"use client";

import { useIntlayer } from "next-intlayer";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@wowlab/shared/components/ui/empty";

export function EmptyResults() {
  const content = useIntlayer("rotationEditor");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyDescription>{content.apiEmptyResults}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
