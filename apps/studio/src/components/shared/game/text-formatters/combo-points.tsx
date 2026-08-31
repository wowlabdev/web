import type { SpellDescFragment } from "wowlab-common";

import { Separator } from "@wowlab/shared/components/ui/separator";
import { stableIndexedId } from "@wowlab/shared/lib/id";

import type { TextFormatter } from "./types";

const CP_TEST = /\d points? ?:/i;

const CP_SPLIT = /(\d) points? ?: ?/i;
const INLINE_KINDS = new Set(["duration", "text", "value"]);

export const comboPoints: TextFormatter = (
  fragments,
  index,
  renderFragment,
  context,
) => {
  const f = fragments[index];

  if (f.kind !== "text" || !CP_TEST.test(f.value)) {
    return null;
  }

  let end = index + 1;

  while (end < fragments.length && INLINE_KINDS.has(fragments[end].kind)) {
    end++;
  }

  const { lines, preamble } = parseComboPointLines(fragments.slice(index, end));

  if (lines.length < 2) {
    return null;
  }

  return {
    consumed: end - index,
    node: (
      <>
        {preamble.map((f, i) => (
          <span key={stableIndexedId("cp-preamble", [f.kind], i)}>
            {renderFragment(f)}
          </span>
        ))}
        <Separator className="my-1.5 bg-neutral-800" />
        <span className="flex flex-col gap-0.5">
          {lines.map((line, i) => (
            <span
              key={stableIndexedId("cp-line", [line.num], i)}
              className="inline-flex items-baseline gap-1 text-xs text-neutral-300"
            >
              <span className="w-14 shrink-0 tabular-nums text-neutral-500">
                {context.comboPointLabel(line.num)}
              </span>
              {line.frags.map((frag, j) => (
                <span
                  key={stableIndexedId("cp-frag", [line.num, frag.kind], j)}
                >
                  {renderFragment(frag)}
                </span>
              ))}
            </span>
          ))}
        </span>
      </>
    ),
  };
};

type ComboLine = { frags: SpellDescFragment[]; num: string };

type ComboParse = { lines: ComboLine[]; preamble: SpellDescFragment[] };

function parseComboPointLines(fragments: SpellDescFragment[]): ComboParse {
  const parse: ComboParse = { lines: [], preamble: [] };

  for (const frag of fragments) {
    if (frag.kind === "text") {
      parseTextFragment(parse, frag.value);
    } else {
      pushFragment(parse, frag);
    }
  }

  return parse;
}

function parseTextFragment(parse: ComboParse, value: string) {
  for (const chunk of splitOnCpLines(value)) {
    if (chunk.num) {
      parse.lines.push({ frags: [], num: chunk.num });

      if (chunk.rest) {
        parse.lines.at(-1)!.frags.push({ kind: "text", value: chunk.rest });
      }
    } else if (chunk.rest) {
      pushText(parse, chunk.rest);
    }
  }
}

function pushFragment(parse: ComboParse, frag: SpellDescFragment) {
  if (parse.lines.length > 0) {
    parse.lines.at(-1)!.frags.push(frag);
  } else {
    parse.preamble.push(frag);
  }
}

function pushText(parse: ComboParse, value: string) {
  if (parse.lines.length > 0) {
    parse.lines.at(-1)!.frags.push({ kind: "text", value });
  } else {
    parse.preamble.push({ kind: "text", value });
  }
}

function splitOnCpLines(text: string): { num: string | null; rest: string }[] {
  const results: { num: string | null; rest: string }[] = [];
  let remaining = text;

  while (remaining) {
    const match = CP_SPLIT.exec(remaining);

    if (!match) {
      results.push({ num: null, rest: remaining });
      break;
    }

    if (match.index > 0) {
      results.push({ num: null, rest: remaining.slice(0, match.index) });
    }

    remaining = remaining.slice(match.index + match[0].length);
    results.push({ num: match[1], rest: remaining.split(CP_SPLIT)[0] ?? "" });
    remaining = remaining.slice(results.at(-1)!.rest.length);
  }

  return results;
}
