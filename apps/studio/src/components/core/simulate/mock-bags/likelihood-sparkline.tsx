"use client";

import { useIntlayer } from "next-intlayer";

import { LineChart } from "@/components/shared/ui/charts";

type LikelihoodSparklineProps = {
  color: string;
  history: number[];
};

export function LikelihoodSparkline({
  color,
  history,
}: Readonly<LikelihoodSparklineProps>) {
  const shared = useIntlayer("simulateShared");

  if (history.length < 2) {
    return null;
  }

  const data = history.map((v, i) => ({
    chunk: i,
    likelihood: Math.round(v * 100),
  }));

  return (
    <div className="w-12">
      <LineChart
        data={data}
        height={16}
        series={[
          { color, dataKey: "likelihood", label: shared.likelihood.value },
        ]}
        showTooltip={false}
        variant="sparkline"
        xAxis={{ dataKey: "chunk" }}
      />
    </div>
  );
}
