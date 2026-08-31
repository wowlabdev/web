"use client";

import { useActivities } from "@/lib/query/services";

export function useUnreadCount() {
  const { data } = useActivities();

  if (!data) {
    return 0;
  }

  return data.items.filter((a) => new Date(a.at) > new Date(data.seen_at))
    .length;
}
