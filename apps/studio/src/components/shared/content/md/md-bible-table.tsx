"use client";

import { TableIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { getTableNumber, groupBySection, tables } from "@/content/tables";

import { MdContentBlock, MdContentList } from "./md-content-block";

const TABLE_CONFIG = {
  icon: TableIcon,
  listPath: "tables",
  prefix: "tbl",
};

type MdBibleTableProps = {
  caption?: string;
  children?: React.ReactNode;
  id: string;
};

export function MdBibleTable({
  caption,
  children,
  id,
}: Readonly<MdBibleTableProps>) {
  const { table } = useIntlayer("article");
  const entry = tables[id];
  const num = getTableNumber(id);

  return (
    <MdContentBlock
      caption={caption}
      config={TABLE_CONFIG}
      entry={entry}
      id={id}
      label={table.label.value}
      labelLower={table.labelLower.value}
      num={num}
    >
      {children}
    </MdContentBlock>
  );
}

export function MdBibleTables() {
  const allTables = Object.values(tables);

  if (allTables.length === 0) {
    return null;
  }

  return (
    <MdContentList
      config={TABLE_CONFIG}
      getNumber={getTableNumber}
      groups={groupBySection(allTables)}
    />
  );
}
