import type { ReactNode } from "react";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { env } from "@wowlab/shared/lib/env";
import { href, routes } from "@wowlab/shared/lib/routing";

type LandingHeaderProps = {
  navBlog: ReactNode;
  navLaunchApp: ReactNode;
  navPricing: ReactNode;
};

export function LandingHeader({
  navBlog,
  navLaunchApp,
  navPricing,
}: Readonly<LandingHeaderProps>) {
  return (
    <header className="sticky top-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-background/55 backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to bottom, black 55%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent)",
        }}
      />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold leading-none tracking-tight"
        >
          <Image
            src="/logo.png"
            alt=""
            width={414}
            height={414}
            priority
            className="size-6"
          />
          WoW Lab
        </Link>
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          <Button asChild variant="ghost" size="sm" className="px-2 sm:px-3">
            <Link href={href(routes.pricing)}>{navPricing}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="px-2 max-[420px]:hidden sm:px-3"
          >
            <Link href={href(routes.blog.index)}>{navBlog}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="ml-1 shadow-lg shadow-primary/20 sm:ml-2"
          >
            <a href={env.APP_URL}>
              {navLaunchApp}
              <ArrowRightIcon className="size-4" />
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
