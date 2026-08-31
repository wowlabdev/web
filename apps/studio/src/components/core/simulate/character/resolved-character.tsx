"use client";

import type { Profile } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { useResolvedPaperdoll } from "@/lib/sim/character";
import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { ResolvedStats } from "./resolved-stats";

type ResolvedCharacterProps = {
  profile: Profile | null;
  specId: number;
};

export function ResolvedCharacter({
  profile,
  specId,
}: Readonly<ResolvedCharacterProps>) {
  const content = useIntlayer("characterPage");
  const { data, error, isError, isLoading, notFound } = useResolvedPaperdoll(
    profile,
    specId,
  );

  if (!profile || notFound) {
    return (
      <p className="text-muted-foreground text-sm">{content.resolvedEmpty}</p>
    );
  }

  if (isLoading) {
    return (
      <SkeletonCard headerWidth="w-16">
        <SkeletonTable cols={["w-24", "w-12"]} leadingIcon rows={8} />
      </SkeletonCard>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-destructive text-sm">{content.resolvedError}</p>
        {error ? (
          <pre className="text-muted-foreground bg-muted/50 overflow-auto rounded-md p-2 text-xs whitespace-pre-wrap">
            {error.message}
          </pre>
        ) : null}
      </div>
    );
  }

  return <ResolvedStats resolved={data} />;
}
