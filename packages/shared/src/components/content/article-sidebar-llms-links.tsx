"use client";

import { BotIcon, CheckIcon, FileTextIcon, PencilIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";
import { env } from "@wowlab/shared/lib/env";

import { SidebarSectionLabel } from "./article-sidebar-section-label";

type ArticleSidebarLlmsLinksProps = {
  editUrl?: string;
  raw?: string;
};

const LINK_CLASS =
  "flex items-center gap-1.5 py-0.5 text-left text-xs text-muted-foreground no-underline transition-colors hover:text-foreground";

export function ArticleSidebarLlmsLinks({
  editUrl,
  raw,
}: Readonly<ArticleSidebarLlmsLinksProps>) {
  const { sidebar: content } = useIntlayer("article");

  return (
    <div>
      <SidebarSectionLabel>{content.forAi}</SidebarSectionLabel>
      <div className="flex flex-col gap-1">
        {raw ? <CopyMarkdownButton raw={raw} /> : null}
        <a
          href={`${env.LANDING_URL}/llms.txt`}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          <BotIcon className="size-3" />
          llms.txt
        </a>
        <a
          href={`${env.LANDING_URL}/llms-full.txt`}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          <BotIcon className="size-3" />
          llms-full.txt
        </a>
        {editUrl ? (
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            <PencilIcon className="size-3" />
            {content.editPage}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function CopyMarkdownButton({ raw }: Readonly<{ raw: string }>) {
  const { sidebar: content } = useIntlayer("article");
  const { copied, copy } = useClipboard();

  return (
    <button type="button" onClick={() => copy(raw)} className={LINK_CLASS}>
      {copied ? (
        <CheckIcon className="size-3" />
      ) : (
        <FileTextIcon className="size-3" />
      )}
      {copied ? content.copied : content.copyMarkdown}
    </button>
  );
}
