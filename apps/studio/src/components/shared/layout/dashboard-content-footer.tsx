"use client";

import { GitCommitHorizontal } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { env } from "@wowlab/shared/lib/env";
import { GitHubIcon } from "@wowlab/shared/lib/icons";
import { makeTranslationsUrl } from "@wowlab/shared/lib/links";

import { StudioLegalLinks } from "./studio-legal-links";

export function DashboardContentFooter() {
  const content = useIntlayer("dashboardLayout");
  const deploymentSha = env.DEPLOYMENT_SHA?.slice(0, 7);

  return (
    <footer className="fl-px-4/6 flex min-w-0 flex-wrap items-center justify-end gap-3 py-3">
      <StudioLegalLinks />
      <a
        className="text-muted-foreground hover:text-foreground flex min-w-0 items-center gap-1.5 text-xs transition-colors"
        href={makeTranslationsUrl()}
        rel="noreferrer"
        target="_blank"
      >
        <GitHubIcon className="size-3.5 shrink-0" />
        <span className="truncate">{content.helpTranslate}</span>
      </a>
      {deploymentSha && env.DEPLOYMENT_URL ? (
        <a
          aria-label={content.deployment({ sha: deploymentSha }).value}
          className="text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1.5 font-mono text-xs transition-colors"
          href={env.DEPLOYMENT_URL}
          rel="noreferrer"
          target="_blank"
        >
          <GitCommitHorizontal className="size-3.5" />
          {deploymentSha}
        </a>
      ) : null}
    </footer>
  );
}
