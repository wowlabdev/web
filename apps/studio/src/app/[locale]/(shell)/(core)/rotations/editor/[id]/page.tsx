import { RotationEditorPage } from "@/components/core/rotations/editor/rotation-editor-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRotationRoute({ params }: Readonly<Props>) {
  const { id } = await params;

  return <RotationEditorPage rotationId={id} />;
}
