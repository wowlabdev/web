"use client";

import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { ActivityItem } from "@/lib/zod";

import { useSpec } from "@/lib/game-data";

import { ActivityItem as ActivityItemCard } from "./activity-item";

type ActivityRendererProps = {
  item: ActivityItem;
  seenAt: string;
};

export function ActivityRenderer({
  item,
  seenAt,
}: Readonly<ActivityRendererProps>) {
  switch (item.type) {
    case "sim_completed": {
      return <SimCompletedRenderer item={item} seenAt={seenAt} />;
    }

    case "sim_failed": {
      return <SimFailedRenderer item={item} seenAt={seenAt} />;
    }
  }
}

function SimCompletedRenderer({
  item,
  seenAt,
}: Readonly<ActivityRendererProps>) {
  const { data: spec } = useSpec(item.payload.spec_id);
  const content = useIntlayer("activityFeed");
  const specName = spec?.name ?? content.unknownSpec.value;

  return (
    <ActivityItemCard
      at={item.at}
      seenAt={seenAt}
      icon={<CheckCircle2Icon className="size-5 text-emerald-500" />}
      title={
        <span className="text-foreground">
          {content.simCompleted({ spec: specName })}
        </span>
      }
    />
  );
}

function SimFailedRenderer({ item, seenAt }: Readonly<ActivityRendererProps>) {
  const { data: spec } = useSpec(item.payload.spec_id);
  const content = useIntlayer("activityFeed");
  const specName = spec?.name ?? content.unknownSpec.value;

  return (
    <ActivityItemCard
      at={item.at}
      seenAt={seenAt}
      icon={<XCircleIcon className="size-5 text-destructive" />}
      title={
        <span className="text-foreground">
          {content.simFailed({ spec: specName })}
        </span>
      }
    />
  );
}
