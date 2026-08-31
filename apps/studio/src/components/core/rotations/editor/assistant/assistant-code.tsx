"use client";

import type { HighlighterCore } from "shiki/core";

import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";

const THEME = "github-dark-dimmed";

let highlighterPromise: Promise<HighlighterCore> | undefined;

export function AssistantCode({
  code,
  language,
}: Readonly<{ code: string; language: string }>) {
  const [html, setHtml] = useState<string>();

  useEffect(() => {
    let active = true;

    void highlight(code, language)
      .then((out) => {
        if (active) {
          setHtml(out);
        }
      })
      .catch(() => {
        if (active) {
          setHtml(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <div className="group/code not-prose relative my-2">
      {html ? (
        <div
          className="overflow-x-auto rounded-md text-xs [&_pre]:p-3 [&_pre]:leading-relaxed"
          // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- shiki escapes the code into safe span markup
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
      <div className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover/code:opacity-100">
        <CopyButton value={code} />
      </div>
    </div>
  );
}

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/jsx.mjs"),
      import("shiki/langs/lua.mjs"),
      import("shiki/langs/markdown.mjs"),
      import("shiki/langs/rust.mjs"),
      import("shiki/langs/toml.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/yaml.mjs"),
    ],
    themes: [import("shiki/themes/github-dark-dimmed.mjs")],
  });

  return highlighterPromise;
}

async function highlight(code: string, language: string): Promise<string> {
  const highlighter = await getHighlighter();
  const lang = highlighter.getLoadedLanguages().includes(language)
    ? language
    : "text";

  return highlighter.codeToHtml(code, { lang, theme: THEME });
}
