import type { ComponentProps } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type BunnyVideoOptions = {
  isAutoplay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  isResponsive?: boolean;
  libraryId: string;
  shouldPreload?: boolean;
  title: string;
  videoId: string;
};

type BunnyVideoProps = BunnyVideoOptions &
  Omit<ComponentProps<"iframe">, "allow" | "src" | "title">;

const BUNNY_PLAYER_ORIGIN = "https://player.mediadelivery.net";
const BUNNY_PLAYER_ALLOW =
  "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture";

export function BunnyVideo({
  allowFullScreen = true,
  className,
  isAutoplay,
  isLooping,
  isMuted,
  isResponsive,
  libraryId,
  loading = "lazy",
  shouldPreload,
  title,
  videoId,
  ...props
}: BunnyVideoProps) {
  return (
    <iframe
      allow={BUNNY_PLAYER_ALLOW}
      allowFullScreen={allowFullScreen}
      className={cn("aspect-video w-full border-0 bg-black", className)}
      loading={loading}
      src={makeBunnyVideoUrl({
        isAutoplay,
        isLooping,
        isMuted,
        isResponsive,
        libraryId,
        shouldPreload,
        videoId,
      })}
      title={title}
      {...props}
    />
  );
}

function booleanParam(value: boolean) {
  return value ? "true" : "false";
}

function makeBunnyVideoUrl({
  isAutoplay,
  isLooping,
  isMuted,
  isResponsive,
  libraryId,
  shouldPreload,
  videoId,
}: Omit<BunnyVideoOptions, "title">) {
  const url = new URL(`/embed/${libraryId}/${videoId}`, BUNNY_PLAYER_ORIGIN);

  url.searchParams.set("autoplay", booleanParam(isAutoplay ?? true));
  url.searchParams.set("loop", booleanParam(isLooping ?? false));
  url.searchParams.set("muted", booleanParam(isMuted ?? false));
  url.searchParams.set("preload", booleanParam(shouldPreload ?? true));
  url.searchParams.set("responsive", booleanParam(isResponsive ?? false));

  return url.toString();
}
