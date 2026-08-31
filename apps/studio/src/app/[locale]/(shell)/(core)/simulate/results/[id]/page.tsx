import { connection } from "next/server";

import { ResultsPage } from "@/components/core/results";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function SimulateResultsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  await connection();

  return <ResultsPage jobId={id} />;
}
