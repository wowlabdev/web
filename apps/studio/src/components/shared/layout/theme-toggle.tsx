"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks";
import { Button } from "@wowlab/shared/components/ui/button";

const THEMES = ["light", "dark", "system"] as const;
const THEME_ICONS: Record<string, typeof MonitorIcon | undefined> = {
  dark: MoonIcon,
  light: SunIcon,
  system: MonitorIcon,
};

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const content = useIntlayer("dashboardLayout");
  const mounted = useMounted();
  const Icon = mounted
    ? (THEME_ICONS[theme ?? "system"] ?? MonitorIcon)
    : MonitorIcon;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(
          THEMES[
            (THEMES.indexOf(theme as (typeof THEMES)[number]) + 1) %
              THEMES.length
          ],
        )
      }
    >
      <Icon />
      <span className="sr-only">{content.themeToggle}</span>
    </Button>
  );
}
