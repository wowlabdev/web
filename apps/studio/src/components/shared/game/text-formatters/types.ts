import type { ReactNode } from "react";
import type { SpellDescFragment } from "wowlab-common";

export type RenderFragment = (fragment: SpellDescFragment) => ReactNode;

export type TextFormatResult = {
  consumed: number;
  node: ReactNode;
};

export type TextFormatter = (
  fragments: SpellDescFragment[],
  index: number,
  renderFragment: RenderFragment,
  context: TextFormatterContext,
) => TextFormatResult | null;

export type TextFormatterContext = {
  comboPointLabel: (num: string) => ReactNode;
};
