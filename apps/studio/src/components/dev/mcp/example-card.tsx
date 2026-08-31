import type { ReactNode } from "react";

import { BotIcon, UserIcon } from "lucide-react";

import { Card, CardContent } from "@wowlab/shared/components/ui/card";

export type Example = {
  prompt: string;
  response: ReactNode;
};

export function ExampleCard({ prompt, response }: Readonly<Example>) {
  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserIcon className="size-3" />
          </span>
          <p className="text-xs font-medium leading-relaxed">{prompt}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BotIcon className="size-3" />
          </span>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {response}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
