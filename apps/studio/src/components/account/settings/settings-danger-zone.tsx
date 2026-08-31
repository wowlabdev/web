"use client";

import { useBoolean } from "ahooks";
import { Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";

import { SettingsDeleteDialog } from "./settings-delete-dialog";

export function SettingsDangerZone() {
  const content = useIntlayer("accountPage");
  const [
    showDeleteConfirm,
    { set: setShowDeleteConfirm, setTrue: openDelete },
  ] = useBoolean(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-4 max-lg:flex-col">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">
                {content.settingsDeleteCardTitle}
              </h3>
              <p className="text-muted-foreground text-sm">
                {content.settingsDeleteCardDescription}
              </p>
            </div>
            <Button
              variant="outline"
              className="hover:bg-destructive/10! text-destructive! border-destructive! max-lg:w-full"
              onClick={openDelete}
            >
              <Trash2Icon className="size-4" />
              {content.settingsDangerDelete}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SettingsDeleteDialog
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </div>
  );
}
