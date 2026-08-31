"use client";

import { useIntlayer } from "next-intlayer";

import type { FleetNode } from "@/lib/query/services";

import { RelativeTime } from "@wowlab/shared/components/common";

type LastSeenCellProps = {
  node: FleetNode;
};

export function LastSeenCell({ node }: Readonly<LastSeenCellProps>) {
  const content = useIntlayer("admin");

  if (node.online) {
    return <>{content.fleet.now}</>;
  }

  if (node.lastSeen) {
    return <RelativeTime at={node.lastSeen} />;
  }

  return <>{content.fleet.never}</>;
}
