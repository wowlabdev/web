"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

type EditorLayoutMobileProps = {
  left: ReactNode;
  right: ReactNode;
  toolbar: ReactNode;
};

export function EditorLayoutMobile({
  left,
  right,
  toolbar,
}: Readonly<EditorLayoutMobileProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <div className="flex flex-col gap-4">
      {toolbar}
      <UrlTabs queryKey="pane" defaultValue="edit" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="edit">{content.mobileTabEdit}</TabsTrigger>
          <TabsTrigger value="preview">{content.mobileTabPreview}</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <div className="p-2">{left}</div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="p-2">{right}</div>
        </TabsContent>
      </UrlTabs>
    </div>
  );
}
