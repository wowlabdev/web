"use client";

import type { ReactNode } from "react";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

import { CodePreview } from "./code-preview";
import { PreCode } from "./pre-code";
import { RENDERERS } from "./renderers";

type MdCodeProps = {
  className?: string;
  children: ReactNode;
  "data-language"?: string;
};

type MdPreProps = {
  className?: string;
  children: ReactNode;
  "data-language"?: string;
  "data-raw-code"?: string;
  "data-theme"?: string;
};

export function MdCode({
  children,
  className,
  ...props
}: Readonly<MdCodeProps>) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

export function MdPre({ children, className, ...props }: Readonly<MdPreProps>) {
  const language = props["data-language"];
  const rawCode = props["data-raw-code"];

  if (language && language in RENDERERS && rawCode) {
    return (
      <CodePreview
        code={rawCode}
        language={language}
        renderer={RENDERERS[language]}
      />
    );
  }

  return (
    <div className="group/code not-prose relative">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
        {language && (
          <Badge
            variant="secondary"
            className="font-mono uppercase tracking-wide"
          >
            {language}
          </Badge>
        )}
        {rawCode && (
          <CopyButton
            value={rawCode}
            className="opacity-0 transition-opacity group-hover/code:opacity-100"
          />
        )}
      </div>
      <PreCode
        className={cn(
          "my-6",
          "[&_[data-highlighted-chars]]:rounded-none [&_[data-highlighted-chars]]:bg-amber-500/20 [&_[data-highlighted-chars]]:px-1",
          "[&_[data-highlighted-line]]:bg-amber-500/10",
          "[&_[data-line]]:-mx-4 [&_[data-line]]:px-4",
          "[&_code]:block [&_code]:border-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-inherit [&_code]:text-inherit",
          className,
        )}
        {...props}
      >
        {children}
      </PreCode>
    </div>
  );
}
