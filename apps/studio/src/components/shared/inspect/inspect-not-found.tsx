import type { ReactNode } from "react";

type InspectNotFoundProps = {
  children: ReactNode;
};

export function InspectNotFound({ children }: Readonly<InspectNotFoundProps>) {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="text-muted-foreground text-sm">{children}</span>
    </div>
  );
}
