import { InspectSpellPage } from "@/components/shared/inspect";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InspectSpellRoute({ params }: Readonly<Props>) {
  const { id } = await params;

  return <InspectSpellPage spellId={Number(id)} />;
}
