"use client";

import { useBoolean } from "ahooks";
import { LinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useUserAccount } from "@/lib/query/services/user";
import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";

export function DiscordLinkBanner() {
  const { linkIdentity, user } = useUserAccount();
  const content = useIntlayer("accountPage");
  const [linking, { setFalse: stopLinking, setTrue: startLinking }] =
    useBoolean(false);

  if (!user.isAuthenticated) {
    return null;
  }

  const handleLink = async () => {
    startLinking();

    try {
      await linkIdentity("discord");
    } catch {
      stopLinking();
    }
  };

  return (
    <Alert variant="default">
      <AlertDescription className="flex items-center justify-between gap-2">
        <span className="text-sm">{content.settingsDiscordBannerText}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleLink}
          disabled={linking}
        >
          <LinkIcon className="size-3" />
          {content.settingsDiscordBannerLink}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
