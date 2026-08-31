import type { ReactNode } from "react";

import { Kbd } from "@wowlab/shared/components/ui/kbd";

type MdKbdProps = {
  children: ReactNode;
};

export function MdKbd({ children }: Readonly<MdKbdProps>) {
  return <Kbd>{children}</Kbd>;
}
