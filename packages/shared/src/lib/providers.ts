import type { ComponentType, SVGProps } from "react";

import {
  DiscordIcon,
  GitHubIcon,
  GoogleIcon,
  TwitchIcon,
} from "@wowlab/shared/lib/icons";

export type OAuthProvider = "discord" | "github" | "google" | "twitch";

export type ProviderMeta = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isEnabled: boolean;
  label: string;
  provider: OAuthProvider;
};

export const OAUTH_PROVIDERS: ProviderMeta[] = [
  { icon: DiscordIcon, isEnabled: true, label: "Discord", provider: "discord" },
  { icon: GitHubIcon, isEnabled: true, label: "GitHub", provider: "github" },
  { icon: GoogleIcon, isEnabled: false, label: "Google", provider: "google" },
  { icon: TwitchIcon, isEnabled: false, label: "Twitch", provider: "twitch" },
];
