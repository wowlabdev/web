"use client";

import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

import type { ImageObject } from "@/components/shared/canvas/scene/types";

type ImageShapeProps = {
  obj: ImageObject;
};

export function ImageShape({ obj }: Readonly<ImageShapeProps>) {
  const [image, status] = useImage(
    obj.imageUrl,
    obj.crossOrigin ?? "anonymous",
    "no-referrer",
  );

  if (status !== "loaded" || !image) {
    return null;
  }

  return (
    <KonvaImage
      image={image}
      x={obj.position.x}
      y={obj.position.y}
      width={obj.size.width}
      height={obj.size.height}
      opacity={obj.opacity ?? 1}
      listening={false}
      perfectDrawEnabled={false}
      transformsEnabled="position"
      shadowForStrokeEnabled={false}
    />
  );
}
