"use client";

import { useIntlayer } from "next-intlayer";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import type { CodeRenderer } from "./renderers";

import { PreCode } from "./pre-code";

type CodePreviewProps = {
  code: string;
  language: string;
  renderer: CodeRenderer;
};

export function CodePreview({
  code,
  language,
  renderer: Renderer,
}: Readonly<CodePreviewProps>) {
  const { codePreview } = useIntlayer("article");
  const rendered = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <Tabs defaultValue="preview" className="my-6">
      <TabsList>
        <TabsTrigger value="preview">{rendered}</TabsTrigger>
        <TabsTrigger value="code">{codePreview.source}</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="pt-4">
        <Renderer code={code} />
      </TabsContent>
      <TabsContent value="code">
        <div className="group/code relative">
          <CopyButton
            value={code}
            className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100"
          />
          <PreCode>
            <code>{code}</code>
          </PreCode>
        </div>
      </TabsContent>
    </Tabs>
  );
}
