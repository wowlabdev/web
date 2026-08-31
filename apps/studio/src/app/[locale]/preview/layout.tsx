import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export const viewport: Viewport = {
  width: 1440,
};

export const dynamic = "force-static";

export default function PreviewLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="dark bg-background min-h-dvh overflow-hidden p-6 text-foreground">
      {children}
    </div>
  );
}
