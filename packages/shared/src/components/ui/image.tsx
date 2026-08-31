"use client";

import NextImage from "next/image";

import { LightboxTrigger } from "./lightbox";

type ImageProps = {
  alt: string;
  expandable?: boolean;
  height?: number;
  src: string;
  width?: number;
};

export function Image({
  alt,
  expandable = false,
  height = 600,
  src,
  width = 900,
}: Readonly<ImageProps>) {
  const imageElement = (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="my-4 max-w-full rounded-lg"
    />
  );

  if (!expandable) {
    return imageElement;
  }

  return (
    <LightboxTrigger variant="image" title={alt} src={src}>
      {imageElement}
    </LightboxTrigger>
  );
}
