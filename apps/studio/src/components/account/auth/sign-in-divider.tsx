import { useIntlayer } from "next-intlayer/server";

import { Separator } from "@wowlab/shared/components/ui/separator";

export function SignInDivider() {
  const content = useIntlayer("signIn");

  return (
    <div className="my-6 flex items-center gap-4">
      <Separator className="flex-1" />
      <p className="text-muted-foreground text-xs uppercase">
        {content.secureAuth}
      </p>
      <Separator className="flex-1" />
    </div>
  );
}
