"use client";

import { useBoolean } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { GameIcon } from "@/components/shared/game";
import { useSpec } from "@/lib/game-data";

import { RotationMetadataSheet } from "../metadata/rotation-metadata-sheet";
import { VariablesPanel } from "../variables/variables-panel";
import { EditorToolbarActions } from "./editor-toolbar-actions";
import { EditorToolbarBreadcrumb } from "./editor-toolbar-breadcrumb";
import { ImportRotationDialog } from "./import-rotation-dialog";

type EditorToolbarProps = {
  rotationId?: string;
  rotationName?: string;
  specId: number;
};

export function EditorToolbar({
  rotationId,
  rotationName,
  specId,
}: Readonly<EditorToolbarProps>) {
  const content = useIntlayer("rotationEditor");
  const { data: spec } = useSpec(specId);
  const [isVariablesOpen, variablesActions] = useBoolean(false);
  const [isMetadataOpen, metadataActions] = useBoolean(false);
  const [isImportOpen, importActions] = useBoolean(false);

  const displayName = rotationName?.trim() ? rotationName : null;
  const breadcrumbCurrent = displayName ?? content.breadcrumbNewRotation.value;

  return (
    <div className="flex flex-col gap-2 border-b pb-3">
      <EditorToolbarBreadcrumb current={breadcrumbCurrent} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          {spec?.file_name && (
            <GameIcon iconName={spec.file_name} size="sm" alt={spec.name} />
          )}
          <h1 className="text-lg font-semibold">{breadcrumbCurrent}</h1>
        </div>
        <EditorToolbarActions
          onOpenImport={importActions.setTrue}
          onOpenMetadata={metadataActions.setTrue}
          onOpenVariables={variablesActions.setTrue}
          rotationId={rotationId}
        />
      </div>
      <RotationMetadataSheet
        isOpen={isMetadataOpen}
        onOpenChange={(v) =>
          v ? metadataActions.setTrue() : metadataActions.setFalse()
        }
      />
      <VariablesPanel
        isOpen={isVariablesOpen}
        onOpenChange={(v) =>
          v ? variablesActions.setTrue() : variablesActions.setFalse()
        }
      />
      <ImportRotationDialog
        isOpen={isImportOpen}
        onOpenChange={(v) =>
          v ? importActions.setTrue() : importActions.setFalse()
        }
      />
    </div>
  );
}
