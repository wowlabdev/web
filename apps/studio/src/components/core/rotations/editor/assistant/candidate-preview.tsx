"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { SectionHeader } from "@wowlab/shared/components/common/section-header";
import { Button } from "@wowlab/shared/components/ui/button";

import type { Candidate } from "./use-assistant-chat";

import { ConditionTreeView } from "../../condition-tree-view";
import { RotationActionList } from "../../rotation-action-list";

type CandidatePreviewProps = {
  candidate: Candidate;
  onApply: () => void;
  onDiscard: () => void;
};

export function CandidatePreview({
  candidate,
  onApply,
  onDiscard,
}: Readonly<CandidatePreviewProps>) {
  const content = useIntlayer("rotationAssistant");

  return (
    <div className="space-y-4">
      <SectionHeader
        align="left"
        title={content.previewTitle}
        titleAs="h2"
        className="space-y-1 [&>*]:text-base [&>*]:normal-case [&>*]:tracking-normal"
      />

      <div className="space-y-4">
        {candidate.kind === "condition" && (
          <ConditionTreeView condition={candidate.object} specMap={null} />
        )}

        {candidate.kind === "list" && (
          <RotationActionList
            actions={candidate.object}
            listName="preview"
            specMap={null}
          />
        )}

        {candidate.kind === "rotation" &&
          Object.entries(candidate.object.lists).map(([listName, actions]) => (
            <RotationActionList
              key={listName}
              actions={actions}
              listName={listName}
              specMap={null}
            />
          ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDiscard}>
          <XIcon className="size-3.5" />
          {content.discardButton}
        </Button>
        <Button size="sm" onClick={onApply}>
          <CheckIcon className="size-3.5" />
          {content.applyButton}
        </Button>
      </div>
    </div>
  );
}
