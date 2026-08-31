"use client";

import { useIntlayer } from "next-intlayer";

import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@wowlab/shared/components/ui/sheet";

import { MetadataAdvancedSection } from "./metadata-advanced-section";
import { MetadataPrimaryFields } from "./metadata-primary-fields";

type RotationMetadataSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RotationMetadataSheet({
  isOpen,
  onOpenChange,
}: Readonly<RotationMetadataSheetProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{content.metadataSheetTitle}</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 px-4 pb-4">
          <Alert>
            <AlertDescription>{content.metadataInfoBanner}</AlertDescription>
          </Alert>
          <MetadataPrimaryFields />
          <MetadataAdvancedSection />
        </div>
      </SheetContent>
    </Sheet>
  );
}
