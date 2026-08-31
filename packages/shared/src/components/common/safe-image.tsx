"use client";

import { useBoolean } from "ahooks";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { type ReactNode } from "react";

type SafeImageInnerProps = {
  fallback: ReactNode;
  src: string;
} & Omit<NextImageProps, "onError" | "src">;

type SafeImageProps = {
  fallback?: ReactNode;
  src: null | string | undefined;
} & Omit<NextImageProps, "onError" | "src">;

export function SafeImage({ fallback = null, src, ...props }: SafeImageProps) {
  if (!src) {
    return <>{fallback}</>;
  }

  return <SafeImageInner key={src} fallback={fallback} src={src} {...props} />;
}

function SafeImageInner({ fallback, src, ...props }: SafeImageInnerProps) {
  const [errored, { setTrue: setErrored }] = useBoolean(false);

  if (errored) {
    return <>{fallback}</>;
  }

  return <NextImage src={src} onError={() => setErrored()} {...props} />;
}
