"use client";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { Label } from "@wowlab/shared/components/ui/label";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { Switch } from "@wowlab/shared/components/ui/switch";
import { clearThemePreference } from "@wowlab/shared/lib/storage";

import { type ConsentCategory, useConsentStore } from "./store";

type CategoryRowProps = {
  id?: string;
  label: string;
  description: string;
  indicator?: string;
  isChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
};

export function CookieSettingsDialog() {
  const content = useIntlayer("cookieConsent");
  const isOpen = useConsentStore((s) => s.isSettingsOpen);
  const closeSettings = useConsentStore((s) => s.closeSettings);
  const acceptAll = useConsentStore((s) => s.acceptAll);
  const rejectAll = useConsentStore((s) => s.rejectAll);
  const saveSelection = useConsentStore((s) => s.saveSelection);
  const storedPreferences = useConsentStore((s) => s.preferences);
  const storedAnalytics = useConsentStore((s) => s.analytics);

  const [draft, setDraft] = useState({
    analytics: storedAnalytics,
    preferences: storedPreferences,
  });
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);

    if (isOpen) {
      setDraft({ analytics: storedAnalytics, preferences: storedPreferences });
    }
  }

  const toggle = (key: ConsentCategory) => (next: boolean) =>
    setDraft((d) => ({ ...d, [key]: next }));

  const apply = (action: () => void) => () => {
    action();

    if (!useConsentStore.getState().preferences) {
      clearThemePreference();
    }

    window.location.reload();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => (next ? null : closeSettings())}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{content.settingsTitle.value}</DialogTitle>
          <DialogDescription>
            {content.settingsDescription.value}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <CategoryRow
            label={content.essentialLabel.value}
            description={content.essentialDescription.value}
            indicator={content.essentialAlwaysOn.value}
          />
          <Separator />
          <CategoryRow
            id="cookie-consent-preferences"
            label={content.preferencesLabel.value}
            description={content.preferencesDescription.value}
            isChecked={draft.preferences}
            onCheckedChange={toggle("preferences")}
          />
          <Separator />
          <CategoryRow
            id="cookie-consent-analytics"
            label={content.analyticsLabel.value}
            description={content.analyticsDescription.value}
            isChecked={draft.analytics}
            onCheckedChange={toggle("analytics")}
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={apply(rejectAll)}>
              {content.settingsRejectAll.value}
            </Button>
            <Button variant="ghost" onClick={apply(acceptAll)}>
              {content.settingsAllowAll.value}
            </Button>
          </div>
          <Button onClick={apply(() => saveSelection(draft))}>
            {content.settingsSave.value}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryRow({
  description,
  id,
  indicator,
  isChecked,
  label,
  onCheckedChange,
}: Readonly<CategoryRowProps>) {
  const isToggle = onCheckedChange !== undefined;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {isToggle ? (
        <Switch
          id={id}
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          aria-label={label}
        />
      ) : (
        <span className="text-muted-foreground shrink-0 text-xs font-medium uppercase tracking-wide">
          {indicator}
        </span>
      )}
    </div>
  );
}
