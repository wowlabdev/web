"use client";

import type { ImplementedSpecInfo } from "wowlab-common";

import { useBoolean } from "ahooks";
import { CircleCheckIcon, DownloadIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { SpecPicker } from "@/components/shared/game";
import { useCommon, useEngine } from "@/components/shared/wasm";
import { parseImplementedSpecs } from "@/lib/wasm/api";
import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import { MetadataDescriptionField } from "../metadata/metadata-description-field";
import { MetadataPrimaryFields } from "../metadata/metadata-primary-fields";
import { MetadataTagsField } from "../metadata/metadata-tags-field";
import { MetadataVisibilityField } from "../metadata/metadata-visibility-field";
import { ImportRotationDialog } from "./import-rotation-dialog";

export function NewRotationPanel() {
  const content = useIntlayer("rotationEditor");
  const common = useCommon();
  const engine = useEngine();
  const specId = useEditorDocument((s) => s.metadata.specId);
  const setDraftSpec = useEditorUi((s) => s.setDraftSpec);
  const confirmNewDraft = useEditorUi((s) => s.confirmNewDraft);
  const [isImportOpen, importActions] = useBoolean(false);
  const [importedFrom, setImportedFrom] = useState<null | string>(null);

  const implementedSpecs = useMemo(
    () =>
      parseImplementedSpecs(
        common,
        engine.getImplementedSpecs(),
      ) as ImplementedSpecInfo[],
    [common, engine],
  );

  return (
    <div className="mx-auto w-full max-w-2xl fl-py-4/8">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{content.newRotationTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {content.selectSpecPrompt}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {content.newRotationSpecTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpecPicker
              onChange={(next) => {
                setImportedFrom(null);
                setDraftSpec(next);
              }}
              specs={implementedSpecs}
              value={specId}
            />
          </CardContent>
        </Card>

        {specId != null && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {content.newRotationDetailsTitle}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={importActions.setTrue}
                >
                  <DownloadIcon className="size-3.5" />
                  {content.newRotationImportButton}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {importedFrom != null && (
                  <Alert>
                    <CircleCheckIcon className="text-emerald-500" />
                    <AlertDescription>
                      {content.newRotationImportedNotice({
                        name: importedFrom,
                      })}
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  {content.newRotationDetailsHint}
                </p>
                <MetadataPrimaryFields />
                <MetadataDescriptionField />
                <MetadataTagsField />
                <MetadataVisibilityField />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={confirmNewDraft}>
                {content.newRotationCreateButton}
              </Button>
            </div>
          </>
        )}
      </div>

      <ImportRotationDialog
        isOpen={isImportOpen}
        onImported={setImportedFrom}
        onOpenChange={(v) =>
          v ? importActions.setTrue() : importActions.setFalse()
        }
      />
    </div>
  );
}
