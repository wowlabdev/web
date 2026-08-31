import { useUpdateEffect } from "ahooks";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { useSimulatorStore } from "@/lib/state";

export function useAutoSelectRotation(
  specId: number | null,
  rotations: Row<"rotations">[] | undefined,
) {
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const setRotationId = useSimulatorStore((s) => s.setRotationId);

  useUpdateEffect(() => {
    if (!specId || !rotations || rotations.length === 0) {
      return;
    }

    if (
      rotationId &&
      rotations.some((rotation) => rotation.id === rotationId)
    ) {
      return;
    }

    setRotationId(rotations[0].id);
  }, [rotations, rotationId, setRotationId, specId]);
}
