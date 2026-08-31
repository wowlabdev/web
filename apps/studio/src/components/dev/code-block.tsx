"use client";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";

type CodeBlockProps = {
  children: string;
  copyValue?: string;
};

export function CodeBlock({ children, copyValue }: Readonly<CodeBlockProps>) {
  return (
    <div className="group/code relative">
      <pre className="overflow-x-auto rounded-none bg-muted/50 p-3 text-xs leading-relaxed ring-1 ring-foreground/10">
        <code>{children}</code>
      </pre>
      <div className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover/code:opacity-100">
        <CopyButton value={copyValue ?? children} />
      </div>
    </div>
  );
}
