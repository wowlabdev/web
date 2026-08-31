"use client";

import { ImageIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { figures, getFigureNumber, groupBySection } from "@/content/figures";

import { MdContentBlock, MdContentList } from "./md-content-block";

const FIGURE_CONFIG = {
  icon: ImageIcon,
  listPath: "figures",
  prefix: "fig",
};

type MdFigureProps = {
  caption?: string;
  children?: React.ReactNode;
  id: string;
};

export function MdFigure({ caption, children, id }: Readonly<MdFigureProps>) {
  const { figure } = useIntlayer("article");
  const entry = figures[id];
  const num = getFigureNumber(id);

  return (
    <MdContentBlock
      caption={caption}
      config={FIGURE_CONFIG}
      entry={entry}
      id={id}
      label={figure.label.value}
      labelLower={figure.labelLower.value}
      num={num}
    >
      {children}
    </MdContentBlock>
  );
}

export function MdFigures() {
  const allFigures = Object.values(figures);

  if (allFigures.length === 0) {
    return null;
  }

  return (
    <MdContentList
      config={FIGURE_CONFIG}
      getNumber={getFigureNumber}
      groups={groupBySection(allFigures)}
    />
  );
}
