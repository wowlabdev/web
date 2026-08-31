"use client";

import type { ReactNode } from "react";
import type { Components } from "react-markdown";

import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

import { GameAura, GameItem, GameSpell } from "@/components/shared/game";
import {
  MdBlockquote,
  MdCode,
  MdDel,
  MdEm,
  MdH1,
  MdH2,
  MdH3,
  MdH4,
  MdH5,
  MdH6,
  MdHr,
  MdLi,
  MdLink,
  MdOl,
  MdParagraph,
  MdStrong,
  MdTable,
  MdTbody,
  MdTd,
  MdTh,
  MdThead,
  MdTr,
  MdUl,
} from "@wowlab/shared/components/content/md";

import { AssistantCode } from "./assistant-code";

const ENTITY_HREF = /^(spell|aura|item):(\d+)$/;

// react-markdown's default sanitizer strips the custom spell:/aura:/item: protocols; let those through.
function transformUrl(url: string): string {
  return ENTITY_HREF.test(url) ? url : defaultUrlTransform(url);
}

const components: Components = {
  a: ({ children, href }) => <EntityLink href={href}>{children}</EntityLink>,
  blockquote: ({ children }) => <MdBlockquote>{children}</MdBlockquote>,
  code: ({ children, className }) => {
    const language = /language-(\w+)/.exec(className ?? "")?.[1];

    return language ? (
      <AssistantCode
        code={String(children).replace(/\n$/, "")}
        language={language}
      />
    ) : (
      <MdCode className={className}>{children}</MdCode>
    );
  },
  del: ({ children }) => <MdDel>{children}</MdDel>,
  em: ({ children }) => <MdEm>{children}</MdEm>,
  h1: ({ children }) => <MdH1>{children}</MdH1>,
  h2: ({ children }) => <MdH2>{children}</MdH2>,
  h3: ({ children }) => <MdH3>{children}</MdH3>,
  h4: ({ children }) => <MdH4>{children}</MdH4>,
  h5: ({ children }) => <MdH5>{children}</MdH5>,
  h6: ({ children }) => <MdH6>{children}</MdH6>,
  hr: () => <MdHr />,
  li: ({ children }) => <MdLi>{children}</MdLi>,
  ol: ({ children }) => <MdOl>{children}</MdOl>,
  p: ({ children }) => <MdParagraph>{children}</MdParagraph>,
  pre: ({ children }) => children,
  strong: ({ children }) => <MdStrong>{children}</MdStrong>,
  table: ({ children }) => <MdTable>{children}</MdTable>,
  tbody: ({ children }) => <MdTbody>{children}</MdTbody>,
  td: ({ children }) => <MdTd>{children}</MdTd>,
  th: ({ children }) => <MdTh>{children}</MdTh>,
  thead: ({ children }) => <MdThead>{children}</MdThead>,
  tr: ({ children }) => <MdTr>{children}</MdTr>,
  ul: ({ children }) => <MdUl>{children}</MdUl>,
};

export function AssistantMarkdown({
  children,
}: Readonly<{ children: string }>) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words [&_img]:my-0 [&_li_p]:my-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={transformUrl}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function EntityLink({
  children,
  href,
}: Readonly<{ children: ReactNode; href?: string }>) {
  const match = href ? ENTITY_HREF.exec(href) : null;

  if (!match) {
    return <MdLink href={href}>{children}</MdLink>;
  }

  const id = Number(match[2]);
  const kind = match[1];

  if (kind === "item") {
    return <GameItem id={id} />;
  }

  if (kind === "aura") {
    return <GameAura spellId={id} />;
  }

  return <GameSpell id={id} />;
}
