import type { ReactNode } from "react";

type MdListProps = {
  children: ReactNode;
};

export function MdLi({ children }: Readonly<MdListProps>) {
  return <li>{children}</li>;
}

export function MdOl({ children }: Readonly<MdListProps>) {
  return <ol>{children}</ol>;
}

export function MdUl({ children }: Readonly<MdListProps>) {
  return <ul>{children}</ul>;
}
