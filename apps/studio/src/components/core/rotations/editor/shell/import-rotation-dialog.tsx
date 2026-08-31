"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import { useImportableRotations, useUserId } from "@/lib/query/services";
import { SkeletonList } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@wowlab/shared/components/ui/command";

import { parseStoredRotation } from "../../rotation-schema";
import { useEditorDocument, useEditorUi } from "../editor-store-provider";

type ImportRotationDialogProps = {
  isOpen: boolean;
  onImported?: (name: string) => void;
  onOpenChange: (open: boolean) => void;
};

export function ImportRotationDialog({
  isOpen,
  onImported,
  onOpenChange,
}: Readonly<ImportRotationDialogProps>) {
  const content = useIntlayer("rotationEditor");
  const formatDate = useDate();
  const userId = useUserId();
  const specId = useEditorDocument((s) => s.metadata.specId) ?? 0;
  const currentRotationId = useEditorDocument((s) => s.metadata.rotationId);
  const replaceScript = useEditorDocument((s) => s.replaceScript);
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);
  const setTrace = useEditorUi((s) => s.setTrace);

  const { data, isLoading } = useImportableRotations(specId, userId);
  const rows = (data ?? []).filter((r) => r.id !== currentRotationId);

  const handleSelect = useMemoizedFn((rotationId: string) => {
    const picked = rows.find((r) => r.id === rotationId);

    if (!picked) {
      return;
    }

    replaceScript(parseStoredRotation(picked.script));
    setSelectionFocus(null);
    setTrace(null);
    onImported?.(picked.name);
    onOpenChange(false);
  });

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={content.importDialogTitle.value}
      description={content.importDialogDescription.value}
    >
      <CommandInput placeholder={content.importSearchPlaceholder.value} />
      <CommandList>
        {isLoading ? (
          <SkeletonList className="p-2" count={3} rowClassName="h-10" />
        ) : (
          <>
            <CommandEmpty>{content.importEmpty}</CommandEmpty>
            {rows.map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.name} ${r.slug} ${r.description ?? ""}`}
                onSelect={() => handleSelect(r.id)}
              >
                <div className="flex w-full min-w-0 items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-medium">
                        {r.name}
                      </span>
                      {r.user_id === userId && (
                        <Badge variant="secondary" className="text-[10px]">
                          {content.importOwnedByYou}
                        </Badge>
                      )}
                      <Badge
                        variant={r.is_public ? "outline" : "secondary"}
                        className="text-[10px]"
                      >
                        {r.is_public
                          ? content.importVisibilityPublic
                          : content.importVisibilityPrivate}
                      </Badge>
                    </div>
                    {r.description && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatDate(new Date(r.updated_at), { dateStyle: "short" })}
                  </span>
                </div>
              </CommandItem>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
