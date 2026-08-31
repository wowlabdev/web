import type { ReactNode } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import { SHARED_STORAGE_KEYS } from "@wowlab/shared/lib/storage";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Error/404 pages render outside next-themes' provider, so they need their own no-flash theme script.
function applyInitialTheme(storageKey: string) {
  try {
    const stored = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (
      stored === "dark" ||
      ((stored === null || stored === "system") && prefersDark)
    ) {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // localStorage/matchMedia can throw in restricted environments
  }
}

const themeScript = `(${applyInitialTheme.toString()})(${JSON.stringify(SHARED_STORAGE_KEYS.theme)});`;

type ErrorPageShellProps = {
  children: ReactNode;
  title: string;
};

export function ErrorPageShell({
  children,
  title,
}: Readonly<ErrorPageShellProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- root error shells render outside the normal layout metadata boundary */}
      <head>
        <title>{title}</title>
        {/* eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- hardcoded no-flash theme script constant, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
