import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

type MdTableProps = {
  children: ReactNode;
};

type MdTbodyProps = {
  children: ReactNode;
};

type MdTdProps = {
  children: ReactNode;
};

type MdTheadProps = {
  children: ReactNode;
};

type MdThProps = {
  children: ReactNode;
};

type MdTrProps = {
  children: ReactNode;
};

export function MdTable({ children }: Readonly<MdTableProps>) {
  return (
    <div className="my-6">
      <Table>{children}</Table>
    </div>
  );
}

export function MdTbody({ children }: Readonly<MdTbodyProps>) {
  return <TableBody>{children}</TableBody>;
}

export function MdTd({ children }: Readonly<MdTdProps>) {
  return <TableCell>{children}</TableCell>;
}

export function MdTh({ children }: Readonly<MdThProps>) {
  return <TableHead>{children}</TableHead>;
}

export function MdThead({ children }: Readonly<MdTheadProps>) {
  return <TableHeader>{children}</TableHeader>;
}

export function MdTr({ children }: Readonly<MdTrProps>) {
  return <TableRow>{children}</TableRow>;
}
