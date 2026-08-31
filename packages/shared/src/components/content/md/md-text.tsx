import type { ReactNode } from "react";

import { Separator } from "@wowlab/shared/components/ui/separator";

type MdTextProps = {
  children: ReactNode;
};

export function MdBlockquote({ children }: Readonly<MdTextProps>) {
  return <blockquote>{children}</blockquote>;
}

export function MdDel({ children }: Readonly<MdTextProps>) {
  return <del className="text-muted-foreground line-through">{children}</del>;
}

export function MdEm({ children }: Readonly<MdTextProps>) {
  return <em className="italic">{children}</em>;
}

export function MdHr() {
  return <Separator className="my-8" />;
}

export function MdParagraph({ children }: Readonly<MdTextProps>) {
  return <p>{children}</p>;
}

export function MdQ({ children }: Readonly<MdTextProps>) {
  return <q className="italic">{children}</q>;
}

export function MdStrong({ children }: Readonly<MdTextProps>) {
  return <strong className="font-semibold">{children}</strong>;
}

export function MdU({ children }: Readonly<MdTextProps>) {
  return <u className="underline">{children}</u>;
}
