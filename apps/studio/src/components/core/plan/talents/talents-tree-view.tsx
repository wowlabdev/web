"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { type ObjectId, PlannerCanvas } from "@/components/shared/canvas";
import { useCommon } from "@/components/shared/wasm";
import { useSpecTraits } from "@/lib/game-data";
import { decodeLoadout, extractSpecIdFromLoadout } from "@/lib/wasm/api";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import { ANNOTATION_LAYER_ID } from "./constants";
import { buildTalentTreeScene } from "./scene/build-scene";
import { useTalentSelection } from "./use-talent-selection";

type TalentsTreeViewProps = {
  submittedLoadout: string;
};

export function TalentsTreeView({
  submittedLoadout,
}: Readonly<TalentsTreeViewProps>) {
  const content = useIntlayer("plan");
  const common = useCommon();

  const decoded = useMemo(() => {
    if (!submittedLoadout) {
      return null;
    }

    try {
      return {
        error: null,
        specId: extractSpecIdFromLoadout(common, submittedLoadout),
        value: decodeLoadout(common, submittedLoadout),
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : content.talentsInvalidLoadout.value,
        specId: 0,
        value: null,
      };
    }
  }, [common, submittedLoadout, content.talentsInvalidLoadout]);

  const specId = decoded?.specId ?? 0;
  const traitsQuery = useSpecTraits(specId);
  const traits = traitsQuery.data;

  const { selectedId, selectedNodeIds, setSelectedId, toggleNode } =
    useTalentSelection();

  const scene = useMemo(() => {
    if (!traits) {
      return null;
    }

    return buildTalentTreeScene(traits, {
      selection: { selectedNodeIds },
    });
  }, [traits, selectedNodeIds]);

  const handleSelect = (id: ObjectId | null) => {
    setSelectedId(id);

    if (!id || !scene) {
      return;
    }

    const obj = scene.objects.find((o) => o.id === id);
    const rawId = obj?.metadata?.rawId;

    if (typeof rawId === "number") {
      toggleNode(rawId);
    }
  };

  return (
    <div className="space-y-4">
      {decoded?.error ? (
        <p className="text-destructive text-xs">{decoded.error}</p>
      ) : null}

      {decoded && !decoded.error && traitsQuery.isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : null}

      {traitsQuery.isError ? (
        <p className="text-destructive text-xs">
          {content.talentsFailedToLoad}
        </p>
      ) : null}

      {scene ? (
        <div className="bg-muted/40 ring-border relative h-[600px] w-full ring-1">
          <PlannerCanvas
            scene={scene}
            selectedId={selectedId}
            onSelect={handleSelect}
            annotationLayerId={ANNOTATION_LAYER_ID}
            exportFileName={`talents-${specId}.png`}
          />
        </div>
      ) : null}

      {decoded?.value ? (
        <pre className="bg-muted overflow-x-auto border p-3 font-mono text-xs">
          {JSON.stringify(decoded.value, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
