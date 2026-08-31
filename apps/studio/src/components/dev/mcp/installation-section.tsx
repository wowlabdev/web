"use client";

import { useBoolean, useMemoizedFn } from "ahooks";
import { EyeIcon, EyeOffIcon, RefreshCwIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { ClientConfig } from "@/lib/mcp/client-configs";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";
import { Separator } from "@wowlab/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";

import { ClientConfigTabs } from "./client-config-tabs";

type InstallationSectionProps = {
  clients: ClientConfig[];
  isDisabled: boolean;
  onRegenerate: () => Promise<void>;
  token: string;
};

type TokenControlsProps = {
  isDisabled: boolean;
  onRegenerate: () => Promise<void>;
  token: string;
};

export function InstallationSection({
  clients,
  isDisabled,
  onRegenerate,
  token,
}: Readonly<InstallationSectionProps>) {
  const content = useIntlayer("mcpPage");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight">
          {content.installation}
        </h2>
        <p className="text-xs text-muted-foreground">
          {content.installationDescription}
        </p>
      </div>

      <ClientConfigTabs clients={clients} />

      <Separator />

      <TokenControls
        isDisabled={isDisabled}
        onRegenerate={onRegenerate}
        token={token}
      />
    </div>
  );
}

function TokenControls({
  isDisabled,
  onRegenerate,
  token,
}: Readonly<TokenControlsProps>) {
  const content = useIntlayer("mcpPage");
  const [revealed, { setFalse: hideAfterRegen, toggle: toggleRevealed }] =
    useBoolean(false);

  const handleRegenerate = useMemoizedFn(async () => {
    await onRegenerate();
    hideAfterRegen();
  });

  const resolveDisplayValue = () => {
    if (revealed) {
      return token;
    }

    if (token) {
      return "\u2022".repeat(20);
    }

    return content.signInForToken.value;
  };
  const displayValue = resolveDisplayValue();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground shrink-0">
          {content.apiToken}
        </span>
        <div className="relative flex-1">
          <Input
            readOnly
            value={displayValue}
            className="pr-20 font-mono text-xs"
          />
          <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-0.5">
            {token && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={toggleRevealed}
                    >
                      {revealed ? (
                        <EyeOffIcon className="size-3.5" />
                      ) : (
                        <EyeIcon className="size-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {revealed ? content.hide : content.reveal}
                  </TooltipContent>
                </Tooltip>
                <CopyButton value={token} />
              </>
            )}
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleRegenerate}
              disabled={isDisabled}
            >
              <RefreshCwIcon className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{content.regenerateToken}</TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-muted-foreground">
        {content.regenerateWarning}
      </p>
    </div>
  );
}
