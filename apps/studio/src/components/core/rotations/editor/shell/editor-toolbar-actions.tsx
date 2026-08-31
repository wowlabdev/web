"use client";

import {
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FilePlusIcon,
  InfoIcon,
  ListTreeIcon,
  Redo2Icon,
  RotateCcwIcon,
  SparklesIcon,
  Undo2Icon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useRouter } from "next/navigation";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { href, routes } from "@wowlab/shared/lib/routing";

import { useAssistantStore } from "../assistant";
import {
  useEditorDocument,
  useEditorHistory,
  useEditorUi,
} from "../editor-store-provider";
import { useEditorLayoutToolbar } from "./editor-layout";
import { EditorToolbarExportMenu } from "./editor-toolbar-export-menu";

type EditorToolbarActionsProps = {
  onOpenImport: () => void;
  onOpenMetadata: () => void;
  onOpenVariables: () => void;
  rotationId?: string;
};

export function EditorToolbarActions({
  onOpenImport,
  onOpenMetadata,
  onOpenVariables,
  rotationId,
}: Readonly<EditorToolbarActionsProps>) {
  const content = useIntlayer("rotationEditor");
  const assistant = useIntlayer("rotationAssistant");
  const router = useRouter();
  const openAssistant = useAssistantStore((s) => s.open);
  const { isPreviewVisible, setPreviewVisible } = useEditorLayoutToolbar();
  const requestNewDraft = useEditorUi((s) => s.requestNewDraft);
  const resetToLoaded = useEditorDocument((s) => s.resetToLoaded);
  const { canRedo, canUndo, redo, undo } = useEditorHistory();

  const canReset = !!rotationId;

  const handleReset = () => {
    if (!canReset) {
      return;
    }

    resetToLoaded();
  };

  const handleNewDraft = () => {
    requestNewDraft();

    if (rotationId) {
      router.push(href(routes.rotations.editor.index));
    }
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => openAssistant()}>
        <SparklesIcon className="size-3.5" />
        <span className="hidden lg:inline">{assistant.openAssistantLabel}</span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={undo}
            disabled={!canUndo}
            aria-label={content.undoAriaLabel.value}
          >
            <Undo2Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{content.undoTooltip}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={redo}
            disabled={!canRedo}
            aria-label={content.redoAriaLabel.value}
          >
            <Redo2Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{content.redoTooltip}</TooltipContent>
      </Tooltip>
      <Button variant="outline" size="sm" onClick={onOpenMetadata}>
        <InfoIcon className="size-3.5" />
        <span className="hidden lg:inline">{content.metadataButtonLabel}</span>
      </Button>
      <Button variant="outline" size="sm" onClick={onOpenVariables}>
        <ListTreeIcon className="size-3.5" />
        <span className="hidden lg:inline">{content.variablesButtonLabel}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNewDraft}
        aria-label={content.newDraftButtonAriaLabel.value}
      >
        <FilePlusIcon className="size-3.5" />
        <span className="hidden lg:inline">{content.newDraftButtonLabel}</span>
      </Button>
      <Button variant="outline" size="sm" onClick={onOpenImport}>
        <DownloadIcon className="size-3.5" />
        <span className="hidden lg:inline">{content.importButtonLabel}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPreviewVisible(!isPreviewVisible)}
        aria-label={content.togglePreviewLabel.value}
        aria-pressed={isPreviewVisible}
      >
        {isPreviewVisible ? (
          <EyeOffIcon className="size-3.5" />
        ) : (
          <EyeIcon className="size-3.5" />
        )}
        <span className="hidden lg:inline">{content.togglePreviewLabel}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        disabled={!canReset}
        aria-label={content.resetButtonAriaLabel.value}
      >
        <RotateCcwIcon className="size-3.5" />
        <span className="hidden lg:inline">{content.resetButtonLabel}</span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button variant="outline" size="sm" disabled>
              {content.saveButtonLabel}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{content.saveButtonTooltipDisabled}</TooltipContent>
      </Tooltip>
      <EditorToolbarExportMenu />
    </div>
  );
}
