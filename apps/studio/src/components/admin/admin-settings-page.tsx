"use client";

import { useBoolean } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Switch } from "@wowlab/shared/components/ui/switch";

export function AdminSettingsPage() {
  const content = useIntlayer("admin");
  const [isMaintenanceMode, { set: setIsMaintenanceMode }] = useBoolean(false);
  const [isRegistrationAllowed, { set: setIsRegistrationAllowed }] =
    useBoolean(true);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{content.settings.maintenanceMode}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {content.settings.maintenanceModeDescription}
            </p>
          </div>
          <Switch
            checked={isMaintenanceMode}
            onCheckedChange={setIsMaintenanceMode}
          />
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{content.settings.localOnly}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{content.settings.registration}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {content.settings.registrationDescription}
            </p>
          </div>
          <Switch
            checked={isRegistrationAllowed}
            onCheckedChange={setIsRegistrationAllowed}
          />
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{content.settings.localOnly}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
