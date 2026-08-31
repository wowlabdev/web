import type { ReactNode } from "react";

import { Link } from "@wowlab/shared/components/ui/link";

type MdLinkProps = {
  href?: string;
  children: ReactNode;
};

export function MdLink({ children, href = "#" }: Readonly<MdLinkProps>) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(isExternal && { rel: "noopener noreferrer", target: "_blank" })}
    >
      {children}
    </Link>
  );
}
