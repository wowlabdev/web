"use client";

import type { Provider } from "@supabase/supabase-js";
import type { FC, SVGProps } from "react";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { DiscordIcon, GitHubIcon, GoogleIcon } from "@wowlab/shared/lib/icons";

import { SignInButton } from "./sign-in-button";

type AuthProvider = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  id: Provider;
  label: string;
};

const AUTH_PROVIDERS: readonly AuthProvider[] = [
  { Icon: DiscordIcon, id: "discord", label: "Discord" },
  { Icon: GitHubIcon, id: "github", label: "GitHub" },
  { Icon: GoogleIcon, id: "google", label: "Google" },
];

const PROVIDER_GRID = "grid w-full grid-cols-3 gap-3";

type SignInProviderButtonsProps = {
  redirectTo: string | undefined;
};

export function SignInProviderButtons({
  redirectTo,
}: Readonly<SignInProviderButtonsProps>) {
  const content = useIntlayer("signIn");
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);

  return (
    <div className={PROVIDER_GRID}>
      {AUTH_PROVIDERS.map(({ Icon, id, label }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <SignInButton
              provider={id}
              redirectTo={redirectTo}
              activeProvider={activeProvider}
              onActiveProviderChange={setActiveProvider}
              aria-label={
                content.continueWithProvider({ provider: label }).value
              }
            >
              <Icon className="size-5" />
            </SignInButton>
          </TooltipTrigger>
          <TooltipContent>
            {content.continueWithProvider({ provider: label })}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export function SignInProviderButtonsSkeleton() {
  return (
    <div className={PROVIDER_GRID}>
      {AUTH_PROVIDERS.map(({ id }) => (
        <Skeleton key={id} className="h-11 w-full" />
      ))}
    </div>
  );
}
