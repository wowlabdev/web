import type { useIntlayer } from "next-intlayer";
import type { useDate, useNumber } from "next-intlayer/format";

import type { SpecRankingRow } from "@/lib/query/services";

export type RankingTableRow = {
  gapFromTop: string;
  scoreText: string;
  trendText: string;
  updatedAtText: string;
} & SpecRankingRow;

export type SpecsContent = ReturnType<
  typeof useIntlayer<"rankings">
>["specsPage"];

export const UNKNOWN = "-";

export function formatCompactDate(
  formatDate: ReturnType<typeof useDate>,
  value: string | null,
) {
  if (!value) {
    return UNKNOWN;
  }

  return formatDate(new Date(value), {
    day: "2-digit",
    month: "short",
  });
}

export function formatOptionalDate(
  formatDate: ReturnType<typeof useDate>,
  value: string | null,
) {
  if (!value) {
    return UNKNOWN;
  }

  return formatDate(new Date(value), {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formatTrend(
  formatNumber: ReturnType<typeof useNumber>,
  content: SpecsContent,
  rankDelta: number | null,
  scoreDelta: number | null,
) {
  const scoreSign = scoreDelta !== null && scoreDelta >= 0 ? "+" : "";
  const scoreText =
    scoreDelta === null
      ? UNKNOWN
      : `${scoreSign}${formatNumber(Math.round(scoreDelta), {
          maximumFractionDigits: 0,
        })}`;

  if (rankDelta === null) {
    return `${UNKNOWN} / ${scoreText}`;
  }

  const resolveRankText = () => {
    if (rankDelta > 0) {
      return content.trendUp({ delta: rankDelta }).value;
    }

    if (rankDelta < 0) {
      return content.trendDown({ delta: rankDelta }).value;
    }

    return content.trendFlat.value;
  };

  return `${resolveRankText()} / ${scoreText}`;
}
