import { InspectItemPage } from "@/components/shared/inspect";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InspectItemRoute({ params }: Readonly<Props>) {
  const { id } = await params;

  return <InspectItemPage itemId={Number(id)} />;
}
