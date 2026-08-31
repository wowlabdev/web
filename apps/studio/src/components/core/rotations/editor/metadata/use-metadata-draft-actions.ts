"use client";

import { useEditorDocument } from "../editor-store-provider";

export function useMetadataDraftActions() {
  const updateMetadataDraft = useEditorDocument((s) => s.updateMetadataDraft);
  const commitMetadata = useEditorDocument((s) => s.commitMetadata);

  return { commitMetadata, updateMetadataDraft };
}
