"use client";

import type { SpellDescFragment } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { type ReactNode, useMemo } from "react";

import { log } from "@/lib/observability";
import { stableIndexedId } from "@wowlab/shared/lib/id";

import { GameIcon } from "./game-icon";
import {
  comboPoints,
  type TextFormatter,
  type TextFormatterContext,
} from "./text-formatters";
const formatters: TextFormatter[] = [comboPoints];

type FragmentRendererProps = {
  fragments: SpellDescFragment[];
};

export function FragmentRenderer({
  fragments,
}: Readonly<FragmentRendererProps>) {
  const content = useIntlayer("gameComponents");
  const context = useMemo<TextFormatterContext>(
    () => ({
      comboPointLabel: (num: string) => {
        const count = Number(num);

        return content.comboPointLabel(count);
      },
    }),
    [content],
  );

  return <>{renderSequence(fragments, context)}</>;
}

// Exhaustiveness guard: a new Rust SpellDescFragment variant breaks the `never` assignment here.
function assertNeverFragment(fragment: never): null {
  if (process.env.NODE_ENV !== "production") {
    log.withMetadata({ fragment }).warn("Unhandled spell description fragment");
  }

  return null;
}

function renderColorSpan(
  fragments: SpellDescFragment[],
  start: number,
): {
  consumed: number;
  node: ReactNode;
} {
  const f = fragments[start];

  if (f.kind !== "colorStart") {
    return { consumed: 1, node: null };
  }

  const hex = f.color;
  const color = `#${hex.slice(2, 4)}${hex.slice(4, 6)}${hex.slice(6, 8)}`;
  const inner: SpellDescFragment[] = [];
  let i = start + 1;

  while (i < fragments.length && fragments[i].kind !== "colorEnd") {
    inner.push(fragments[i]);
    i++;
  }

  const consumed = i < fragments.length ? i - start + 1 : i - start;

  return {
    consumed,
    node: (
      <span style={{ color, textShadow: "1px 1px 1px rgba(0,0,0,0.8)" }}>
        {inner.map((child, j) => (
          <span key={stableIndexedId("fragment", [child.kind], j)}>
            {renderFragment(child)}
          </span>
        ))}
      </span>
    ),
  };
}

function renderFragment(fragment: SpellDescFragment): ReactNode {
  switch (fragment.kind) {
    case "colorEnd":
    case "colorStart": {
      return null;
    }

    case "duration":
    case "value": {
      return (
        <span className="font-medium text-amber-400">{fragment.value}</span>
      );
    }

    case "embedded": {
      return <FragmentRenderer fragments={fragment.fragments} />;
    }

    case "icon": {
      return (
        <span className="mx-0.5 inline-block align-middle">
          <GameIcon iconName={fragment.path} size="sm" />
        </span>
      );
    }

    case "rawToken": {
      return (
        <code className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {fragment.value}
        </code>
      );
    }

    case "spellName": {
      return <span className="text-amber-300">{fragment.name}</span>;
    }

    case "text": {
      return <>{fragment.value}</>;
    }

    case "unresolved": {
      return (
        <span className="italic text-muted-foreground">{fragment.token}</span>
      );
    }

    default: {
      return assertNeverFragment(fragment);
    }
  }
}

function renderSequence(
  fragments: SpellDescFragment[],
  context: TextFormatterContext,
): ReactNode {
  const out: ReactNode[] = [];
  let i = 0;

  while (i < fragments.length) {
    if (fragments[i].kind === "colorStart") {
      const { consumed, node } = renderColorSpan(fragments, i);

      out.push(<span key={i}>{node}</span>);
      i += consumed;
      continue;
    }

    let matched = false;

    for (const fmt of formatters) {
      const result = fmt(fragments, i, renderFragment, context);

      if (result) {
        out.push(<span key={i}>{result.node}</span>);
        i += result.consumed;
        matched = true;
        break;
      }
    }

    if (!matched) {
      out.push(<span key={i}>{renderFragment(fragments[i])}</span>);
      i++;
    }
  }

  return <>{out}</>;
}
