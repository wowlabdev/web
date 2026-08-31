"use client";

import { useIntlayer } from "next-intlayer";

import { DEFAULT_SPEC_ID } from "@/components/int/__fixtures__/game-fixtures";
import { GameSpec } from "@/components/shared/game";
import { useSpec, useSpecList, useSpecTraits } from "@/lib/game-data";
import { Badge } from "@wowlab/shared/components/ui/badge";

import { ByIdDemo } from "./by-id-demo";
import { SimpleListDemo } from "./demo-helpers";
import { useEntityColumns } from "./use-entity-columns";

export function UseSpecDemo() {
  return (
    <ByIdDemo
      useResult={useSpec}
      defaultId={DEFAULT_SPEC_ID}
      render={(id) => <GameSpec specId={id} size="md" />}
    />
  );
}

export function UseSpecListDemo() {
  const columns = useEntityColumns();

  return (
    <SimpleListDemo
      useResult={useSpecList}
      columns={columns.spec}
      keep={(spec) => Boolean(spec.class_name)}
      title="useSpecList"
    />
  );
}

export function UseSpecTraitsDemo() {
  const content = useIntlayer("hooksPage");

  return (
    <ByIdDemo
      useResult={useSpecTraits}
      defaultId={DEFAULT_SPEC_ID}
      render={() => <Badge variant="outline">{content.resolved}</Badge>}
    />
  );
}
