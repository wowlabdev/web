import { RotationViewPage } from "@/components/core/rotations";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RotationViewRoute({ params }: Readonly<Props>) {
  const { id } = await params;

  return <RotationViewPage rotationId={id} />;
}
