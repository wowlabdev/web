"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { buildClientConfigs } from "@/lib/mcp/client-configs";
import { useAuthUser } from "@/lib/query/services";
import { useRegenerateToken, useToken } from "@/lib/query/services/auth";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { makePricingUrl } from "@wowlab/shared/lib/links";

import { ExamplesSection } from "./mcp/examples-section";
import { InstallationSection } from "./mcp/installation-section";
import { ToolsSection } from "./mcp/tools-section";

export function McpPage() {
  const content = useIntlayer("mcpPage");
  const { subscription } = useAuthUser();
  const { data: token = "", isLoading } = useToken("api");
  const { isPending: isRegenerating, mutateAsync: regenerate } =
    useRegenerateToken("api");

  const clients = useMemo(() => buildClientConfigs(token), [token]);

  if (!subscription.isActive) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{content.paidFeature}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{content.paywallTitle}</p>
              <p className="text-muted-foreground text-sm">
                {content.paywallDescription}
              </p>
            </div>
            <Button asChild size="sm">
              <a href={makePricingUrl()}>{content.viewPlans}</a>
            </Button>
          </CardContent>
        </Card>

        <ToolsSection />

        <ExamplesSection />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InstallationSection
        clients={clients}
        isDisabled={isLoading || isRegenerating}
        onRegenerate={async () => {
          await regenerate();
        }}
        token={token}
      />

      <ToolsSection />

      <ExamplesSection />
    </div>
  );
}
