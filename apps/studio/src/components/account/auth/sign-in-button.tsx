"use client";

import type { Provider } from "@supabase/supabase-js";
import type { ComponentProps, MouseEvent } from "react";

import { useMemoizedFn } from "ahooks";

import { signInWithProvider } from "@/lib/query/services";
import { Button } from "@wowlab/shared/components/ui/button";
import { cn } from "@wowlab/shared/lib/utils";

type SignInButtonProps = {
  activeProvider: Provider | null;
  onActiveProviderChange: (provider: Provider | null) => void;
  provider: Provider;
  redirectTo?: string;
} & ComponentProps<typeof Button>;

export function SignInButton({
  activeProvider,
  children,
  className,
  onActiveProviderChange,
  onClick,
  provider,
  redirectTo,
  ...props
}: Readonly<SignInButtonProps>) {
  const isLoading = activeProvider === provider;
  const isGroupBusy = activeProvider !== null;

  const handleSignIn = useMemoizedFn(
    async (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onActiveProviderChange(provider);

      try {
        await signInWithProvider(provider, redirectTo);
      } finally {
        onActiveProviderChange(null);
      }
    },
  );

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("h-11 w-full gap-2", className)}
      loading={isLoading}
      disabled={isGroupBusy && !isLoading}
      {...props}
      onClick={handleSignIn}
    >
      {isLoading ? null : children}
    </Button>
  );
}
