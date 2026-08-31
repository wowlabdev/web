import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { env } from "@wowlab/shared/lib/env";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@wowlab/shared/lib/seo";
import { cn } from "@wowlab/shared/lib/utils";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  formatDetection: { address: false, email: false, telephone: false },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { type: "image/svg+xml", url: "/favicon.svg" },
      { sizes: "96x96", type: "image/png", url: "/favicon-96x96.png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(env.LANDING_URL),
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  referrer: "origin-when-cross-origin",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#fbfafc", media: "(prefers-color-scheme: light)" },
    { color: "#1a181f", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        {children}
      </body>
    </html>
  );
}
