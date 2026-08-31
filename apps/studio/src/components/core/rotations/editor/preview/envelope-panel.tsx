"use client";

import { useIntlayer } from "next-intlayer";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { HeaderPanel } from "@wowlab/shared/components/common/header-panel";
import { PreCode } from "@wowlab/shared/components/content/md/md-code";

type EnvelopePanelProps = {
  simConfig: null | string;
};

export function EnvelopePanel({ simConfig }: Readonly<EnvelopePanelProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <HeaderPanel
      actions={simConfig ? <CopyButton value={simConfig} /> : undefined}
      description={content.previewEnvelopeDescription}
      railColor="purple"
      title={content.previewEnvelopeTitle}
      titleAs="h2"
    >
      <PreCode className="mt-2 max-h-[calc(100vh-16rem)] min-h-48 text-xs whitespace-pre-wrap">
        <code>{simConfig ?? content.previewEnvelopeEmpty}</code>
      </PreCode>
    </HeaderPanel>
  );
}
