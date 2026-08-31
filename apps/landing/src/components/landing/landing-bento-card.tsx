import type { ReactNode } from "react";

import { ArrowRightIcon } from "lucide-react";

export type LandingBentoCell = {
  cta?: { href: string; label: ReactNode };
  description: string;
  icon?: ReactNode;
  media: ReactNode;
  title: string;
};

export function LandingBentoCard({
  cell,
}: Readonly<{ cell: LandingBentoCell }>) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-xl shadow-black/25">
      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="p-6">
          {cell.icon}
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
            {cell.title}
          </h3>
          <p className="text-sm leading-6 text-white/65 sm:text-base">
            {cell.description}
          </p>
          {cell.cta && (
            <a
              href={cell.cta.href}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {cell.cta.label}
              <ArrowRightIcon className="size-3.5" />
            </a>
          )}
        </div>
        <div className="relative flex-1 px-6 pb-6">{cell.media}</div>
      </div>
    </div>
  );
}
