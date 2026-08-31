"use client";

import { useInterval, useKeyPress, useMemoizedFn } from "ahooks";
import {
  AlertTriangleIcon,
  ExternalLinkIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Alert, AlertTitle } from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { useLocalizedRouter } from "@wowlab/shared/lib/routing";
const REDIRECT_DELAY_SECONDS = 20;

type ExternalWarningProps = {
  targetUrl: string;
  targetHost: string;
};

export function ExternalWarning({
  targetHost,
  targetUrl,
}: Readonly<ExternalWarningProps>) {
  const content = useIntlayer("goExternal");
  const router = useLocalizedRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_SECONDS);
  const redirectNow = useMemoizedFn(() => {
    window.location.assign(targetUrl);
  });

  useInterval(
    () => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          redirectNow();

          return 0;
        }

        return value - 1;
      });
    },
    secondsLeft > 0 ? 1000 : undefined,
  );
  useKeyPress("enter", redirectNow);

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3 text-foreground">
            <ShieldAlertIcon className="text-muted-foreground size-6" />
            <CardTitle className="text-2xl tracking-tight">
              {content.title}
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed">
            {content.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              {content.destination}
            </p>
            <p className="font-mono text-base break-all">{targetUrl}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {content.host({ host: targetHost })}
            </p>
          </div>

          <Alert>
            <AlertTriangleIcon />
            <AlertTitle>{content.redirectingIn(secondsLeft)}</AlertTitle>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={redirectNow}>
              <ExternalLinkIcon className="size-4" />
              {content.redirectNow}
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.back()}>
              {content.goBack}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
